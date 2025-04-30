import Axios from 'axios'

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
