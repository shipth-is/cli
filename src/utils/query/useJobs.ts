import {UseQueryResult, useQuery} from '@tanstack/react-query'
import axios, {AxiosError} from 'axios'

import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL, cacheKeys} from '@cli/constants/index.js'
import {Job, OffsetPaginatedResponse, PageAndSortParams} from '@cli/types'
import {castArrayObjectDates} from '@cli/utils/index.js'

export interface JobsQueryProps extends PageAndSortParams {
  projectId: string
}

export type JobsQueryResponse = OffsetPaginatedResponse<Job>

export async function queryJobs({projectId, ...pageAndSortParams}: JobsQueryProps): Promise<JobsQueryResponse> {
  try {
    const headers = getAuthedHeaders()
    const url = `${API_URL}/projects/${projectId}/jobs`
    const response = await axios.get(url, {headers, params: pageAndSortParams})
    return {
      ...response.data,
      data: castArrayObjectDates<Job>(response.data.data),
    }
  } catch (error) {
    console.warn('queryJobs Error', error)
    throw error
  }
}

export const useJobs = (props: JobsQueryProps): UseQueryResult<JobsQueryResponse, AxiosError> => {
  const queryResult = useQuery<JobsQueryResponse, AxiosError>({
    queryFn: async () => queryJobs(props),
    queryKey: cacheKeys.jobs(props),
  })

  return queryResult
}
