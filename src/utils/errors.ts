import Axios from 'axios'

import {HandledError} from '@cli/types/index.js'

import {getShortUUID} from './uuid.js'

export function isNetworkError(exception: any) {
  if (!Axios.isAxiosError(exception)) return false
  return ['ECONNABORTED', 'ERR_NETWORK'].includes(`${exception.code}`)
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
