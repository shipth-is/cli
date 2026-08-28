import Axios from 'axios'

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
