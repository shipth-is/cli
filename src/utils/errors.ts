import Axios from 'axios'

import {HandledError} from '@cli/types/index.js'

import {getShortUUID} from './uuid.js'

export function isNetworkError(exception: any) {
  if (!Axios.isAxiosError(exception)) return false
  return ['ECONNABORTED', 'ERR_NETWORK'].includes(`${exception.code}`)
}

// A 4xx means the request itself was wrong, so sending it again gives the same
// answer. These two are the exceptions. Both ask the client to come back later.
// A 403 is not here. On an authenticated call it never recovers, and a caller
// that can recover from one, such as a stale signed URL, handles it itself.
const RETRYABLE_CLIENT_STATUSES = new Set([408, 429])

// fetch answers a failed request with a Response instead of throwing, so the
// response needs converting before it can travel like any other error.
// axios sets `status` on the errors it throws, so this sets the same field.
export function getResponseError(response: Response, what: string) {
  return Object.assign(new Error(`${what} failed: ${response.status} ${response.statusText}`), {
    status: response.status,
  })
}

// Decides whether another attempt at a failed request is worth making
export function isRetryable(error: unknown) {
  const {status} = error as {status?: number}

  // No status means the request never got an answer. A dropped connection and a
  // timeout both land here, and both deserve another attempt.
  if (status === undefined) return true

  return status >= 500 || RETRYABLE_CLIENT_STATUSES.has(status)
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
