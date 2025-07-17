import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL, cacheKeys} from '@cli/constants/index.js'
import {useQuery} from '@tanstack/react-query'
import axios, {AxiosError, AxiosRequestConfig} from 'axios'

export enum KeyTestStatus {
  ERROR = 'error',
  SUCCESS = 'success',
}

export enum KeyTestError {
  APP_NOT_FOUND = 'app_not_found',
  NO_PACKAGE_NAME = 'no_package_name',
  NO_SERVICE_ACCOUNT_KEY = 'no_service_account_key',
  NOT_INVITED = 'not_invited',
}

export const KeyTestErrorMessage: Record<KeyTestError, string> = {
  [KeyTestError.APP_NOT_FOUND]: 'Application not found in Google Play Console',
  [KeyTestError.NO_PACKAGE_NAME]: 'Android Package Name has not been set',
  [KeyTestError.NO_SERVICE_ACCOUNT_KEY]: 'Service Account API Key not found in your account',
  [KeyTestError.NOT_INVITED]: 'Service Account has not been invited to Google Play',
}

export function niceError(keyError: KeyTestError | undefined): string | undefined {
  return keyError ? KeyTestErrorMessage[keyError] : undefined
}

export interface KeyTestResult {
  error?: KeyTestError
  message?: string
  status: KeyTestStatus
}

export interface TestQueryProps {
  projectId: string
}

export const fetchKeyTestResult = async (
  {projectId}: TestQueryProps,
  config?: AxiosRequestConfig,
): Promise<KeyTestResult> => {
  if (!projectId) throw new Error('projectId is required')
  const url = `${API_URL}/projects/${projectId}/credentials/android/key/test`
  const headers = getAuthedHeaders()
  // Note: this is a POST request with an empty body
  const {data} = await axios.post(url, {}, {headers, ...config})
  return data
}

export const useAndroidServiceAccountTestResult = (props: TestQueryProps) => useQuery<KeyTestResult, AxiosError>({
    queryFn: () => fetchKeyTestResult(props),
    queryKey: cacheKeys.androidKeyTestResult(props),
  })
