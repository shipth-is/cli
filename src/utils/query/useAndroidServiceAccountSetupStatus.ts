import axios, {AxiosError} from 'axios'
import {UseQueryResult, useQuery} from '@tanstack/react-query'

import {API_URL, cacheKeys} from '@cli/constants/index.js'
import {castObjectDates} from '@cli/utils/index.js'
import {AndroidServiceAccountSetupStatus} from '@cli/types'

import {getAuthedHeaders} from '@cli/api/index.js'

export interface StatusQueryProps {
  projectId: string
}

export async function fetchStatus({projectId}: StatusQueryProps): Promise<AndroidServiceAccountSetupStatus> {
  try {
    if (!projectId) throw new Error('projectId is required')
    const headers = getAuthedHeaders()
    const url = `${API_URL}/projects/${projectId}/credentials/android/key/status/`
    const response = await axios.get(url, {headers})
    return castObjectDates<AndroidServiceAccountSetupStatus>(response.data)
  } catch (error) {
    console.warn('fetchStatus Error', error)
    throw error
  }
}

export const useAndroidServiceAccountSetupStatus = (
  props: StatusQueryProps,
): UseQueryResult<AndroidServiceAccountSetupStatus> => {
  return useQuery<AndroidServiceAccountSetupStatus, AxiosError>({
    queryKey: cacheKeys.androidSetupStatus(props),
    queryFn: () => fetchStatus(props),
    // Status changes frequently, so we want to keep it fresh
    refetchInterval: 1000 * 5,
    staleTime: 1000 * 5,
  })
}
