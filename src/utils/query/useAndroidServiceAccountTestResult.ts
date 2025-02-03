import {API_URL, cacheKeys} from '@cli/constants/index.js'

import axios, {AxiosError, AxiosRequestConfig} from 'axios'
import {useQuery} from '@tanstack/react-query'

import {getAuthedHeaders} from '@cli/api/index.js'

export enum KeyTestStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum KeyTestError {
  NO_SERVICE_ACCOUNT_KEY = 'no_service_account_key',
  NO_PACKAGE_NAME = 'no_package_name',
  APP_NOT_FOUND = 'app_not_found',
  NOT_INVITED = 'not_invited',
}

export interface KeyTestResult {
  status: KeyTestStatus
  error?: KeyTestError
  message?: string
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

export const useAndroidServiceAccountTestResult = (props: TestQueryProps) => {
  return useQuery<KeyTestResult, AxiosError>({
    queryKey: cacheKeys.androidKeyTestResult(props),
    queryFn: () => fetchKeyTestResult(props),
  })
}
