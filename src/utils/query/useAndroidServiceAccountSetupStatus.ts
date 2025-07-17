import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL, cacheKeys} from '@cli/constants/index.js'
import {AndroidServiceAccountSetupStatus} from '@cli/types'
import {castObjectDates} from '@cli/utils/index.js'
import {UseQueryResult, useQuery} from '@tanstack/react-query'
import axios, {AxiosError} from 'axios'

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
): UseQueryResult<AndroidServiceAccountSetupStatus> => useQuery<AndroidServiceAccountSetupStatus, AxiosError>({
    queryFn: () => fetchStatus(props),
    queryKey: cacheKeys.androidSetupStatus(props),
    // Status changes frequently, so we want to keep it fresh
    refetchInterval: 1000 * 5,
    staleTime: 1000 * 5,
  })
