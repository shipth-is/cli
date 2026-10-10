import Axios from 'axios'

// Imported from the file, not from `constants/index.js` - that builds the oclif flags, and
// importing it here has caused a circular import before (see 4a7357f).
import {CREATE_A_PROJECT_DOCS, CREATE_GAME_COMMAND, WIZARD_COMMANDS} from '@cli/constants/commands.js'
import {HandledError, Job} from '@cli/types/index.js'

import {getShortUUID} from './uuid.js'

export function isNetworkError(exception: any) {
  if (!Axios.isAxiosError(exception)) return false
  return ['ECONNABORTED', 'ERR_NETWORK'].includes(`${exception.code}`)
}

// A 4xx means the request was wrong, so sending it again gives the same answer.
// These two ask the client to come back later. A 403 is not here - a caller that
// can recover from one, such as a stale signed URL, handles it itself.
const RETRYABLE_CLIENT_STATUSES = [408, 429]

// S3 uses 400 for a socket that went quiet, which is temporary. The status
// cannot tell that apart from a request that was really wrong, so the name does.
const RETRYABLE_S3_CODES = [
  'InternalError',
  'RequestTimeout',
  'RequestTimeoutException',
  'ServiceUnavailable',
  'SlowDown',
]

// The two fields isRetryable reads. axios already sets `status` on what it throws.
type RequestError = Error & {code?: string; status?: number}

// Converts a failed S3 request into an error. fetch does not throw on a bad
// status, and `400 Bad Request` on its own tells nobody anything, so the name
// and sentence from the small XML body S3 sends go into the message.
export async function getS3Error(response: Response, what: string) {
  const body = await response.text().catch(() => '')
  const code = /<Code>([^<]+)<\/Code>/.exec(body)?.[1]
  const message = /<Message>([^<]+)<\/Message>/.exec(body)?.[1]
  const detail = [code ?? response.statusText, message].filter(Boolean).join(' - ')

  const error: RequestError = new Error(`${what} failed: ${response.status} ${detail}`)
  error.code = code
  error.status = response.status

  return error
}

// Decides whether another attempt at a failed request is worth making
export function isRetryable(error: unknown) {
  const {code, status} = error as RequestError
  // An S3 name is more exact than the status, so it answers first
  if (code !== undefined) return RETRYABLE_S3_CODES.includes(code)
  // No status means the request never got an answer, which is worth another try
  if (status === undefined) return true
  return status >= 500 || RETRYABLE_CLIENT_STATUSES.includes(status)
}

// Carries the job, so a caller outside the wizard can show its logs. The wizard
// draws in the alternate screen buffer, which the terminal discards on exit, so
// the failure summary has to be printed after that buffer closes.
export class JobFailedError extends Error {
  constructor(public readonly job: Job) {
    super(`Job ${getShortUUID(job.id)} failed`)
    this.name = 'JobFailedError'
  }
}

// Util to extract API error messages if present
export function getErrorMessage(error: any) {
  try {
    if (isNetworkError(error)) {
      return 'Please check your internet connection.'
    }

    const data = error?.response?.data
    // Zod errors from the backend are an array
    const apiValidation = Array.isArray(data)
      ? data.map((r) => ('message' in r ? `Error - ${r.message}` : r.toString())).join(' ')
      : ''

    const apiErr = error?.response?.data?.error || ''
    const apiMsg = `${apiErr}${apiValidation ? ' ' + apiValidation : ''}`
    if (apiMsg.length === 0) {
      return 'message' in error ? error.message : error.toString()
    }

    return apiMsg
  } catch {
    return error ? error.toString() : 'Error'
  }
}

// Converts any error into a HandledError with a user-friendly message, if possible
export function toHandledError(error: any, context: {projectId?: string} = {}) {
  if (isNetworkError(error)) {
    return new HandledError('Please check your internet connection.')
  }

  const {projectId} = context || {}
  const statusCode = error?.response?.status || error.status

  switch (statusCode) {
    case 404: {
      const msg = projectId
        ? `Game "${getShortUUID(projectId)}" not found. You may not have access to this game.\nRun \`shipthis game list\` to see your games.`
        : 'Requested resource not found.'
      return new HandledError(msg)
    }
    case 401:
      return new HandledError(`Unauthorized. Please run \`shipthis login\` to log in.`)
    case 500:
      return new HandledError(`Server error. Please try again later.`)
    default:
      return error
  }
}

// The resultCode the Developer Portal sends with "You currently don't have access to this
// membership resource". The code field is only FORBIDDEN_ERROR, which Apple uses for every 403.
const APPLE_MEMBERSHIP_RESULT_CODE = 1200

// The App Store Connect side sends its own text for the same problem. It names an API key, but
// the request uses the Apple login session, so the text is misleading.
const APPLE_MEMBERSHIP_DETAILS = ['membership resource', 'The API key in use does not allow this request']

interface AppleErrorInfo {
  detail?: string
  resultCode?: number
}

// Converts an Apple error into a HandledError with a user-friendly message, if possible.
// Apple sends the same 403 for an agreement that is not accepted, an expired membership and
// a role without access. It does not say which, so the message gives all three.
export function toAppleHandledError(error: any) {
  const response = error?.response ?? error?.cause?.response
  if (response?.status !== 403) return error

  const appleErrors: AppleErrorInfo[] = response.data?.errors ?? []
  const membershipError = appleErrors.find(
    (e) =>
      e.resultCode === APPLE_MEMBERSHIP_RESULT_CODE ||
      APPLE_MEMBERSHIP_DETAILS.some((detail) => e.detail?.includes(detail)),
  )
  if (!membershipError) return error

  return new HandledError(
    'Apple did not give access to the resources of this Apple Developer team.\n' +
      'Usually, the team has an agreement that you must accept. Sign in at https://developer.apple.com/account, ' +
      'select the team, and accept the agreements that it shows.\n' +
      'Apple also gives this error if the membership has expired, or if your role on the team cannot access them.\n' +
      `Apple said: ${membershipError.detail}`,
  )
}

/**
 * A failure a command reports. The fields match the options `this.error()` takes, so a
 * caller passes them straight through and oclif prints the suggestions and the reference.
 */
export interface CommandError {
  message: string
  ref?: string
  suggestions?: string[]
}

// One `\n`, after the first sentence. oclif wraps the rest itself.
const NO_GAME_MESSAGE =
  'No game is set up in this directory.\n' +
  'Run the wizard for the platform you want to ship to, or name a game you already have ' +
  'with --gameId. Run `shipthis game list` to see your game IDs.'

/**
 * The answer to "there is no game here". `commandName` is the command the user typed, such
 * as "shipthis game status", and an empty name drops the --gameId suggestion. `platform`
 * narrows the wizard suggestion to one line.
 */
export function getNoGameError(commandName: string, platform?: string): CommandError {
  // A command that knows the platform names one wizard. Every other case names both.
  const forPlatform = platform ? WIZARD_COMMANDS.filter((command) => command.endsWith(` ${platform}`)) : []

  // `shipthis --gameId <id>` is not a command, so an empty name drops the line.
  const showGameId = Boolean(commandName)

  const suggestions = [
    ...(forPlatform.length > 0 ? forPlatform : WIZARD_COMMANDS),
    ...(showGameId ? [`${commandName} --gameId <id>`] : []),
    CREATE_GAME_COMMAND,
  ]

  return {
    message: NO_GAME_MESSAGE,
    ref: CREATE_A_PROJECT_DOCS,
    suggestions,
  }
}
