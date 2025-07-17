import {InfiniteData, UseInfiniteQueryResult, useInfiniteQuery} from '@tanstack/react-query'
import axios, {AxiosError} from 'axios'

import {getAuthedHeaders} from '@cli/api/index.js'
import {cacheKeys} from '@cli/constants/cacheKeys.js'
import {API_URL} from '@cli/constants/index.js'
import {CursorPaginatedResponse, JobLogEntry} from '@cli/types'
import {castArrayObjectDates} from '@cli/utils/index.js'

export interface JobLogsQueryProps {
  cursor?: string
  jobId: string
  pageSize?: number
  projectId: string
}

export type JobLogsQueryResponse = CursorPaginatedResponse<JobLogEntry>

export async function queryJobLogs({
  cursor,
  jobId,
  pageSize = 10,
  projectId,
}: JobLogsQueryProps): Promise<JobLogsQueryResponse> {
  try {
    const headers = getAuthedHeaders()
    const base = `${API_URL}/projects/${projectId}/jobs/${jobId}/logs/?pageSize=${pageSize}`
    const url = base + (cursor ? `&cursor=${cursor}` : '')
    const response = await axios.get(url, {headers})
    return {
      ...response.data,
      data: castArrayObjectDates<JobLogEntry>(response.data.data, ['sentAt', 'createdAt']),
    }
  } catch (error) {
    console.warn('queryJobLogs Error', error)
    throw error
  }
}

export const useJobLogs = (
  props: JobLogsQueryProps,
): UseInfiniteQueryResult<InfiniteData<JobLogsQueryResponse>, AxiosError> => {
  const queryResult = useInfiniteQuery<JobLogsQueryResponse, AxiosError>({
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: props.cursor,
    async queryFn({pageParam}) {
      return queryJobLogs({
        ...props,
        cursor: pageParam as string,
      })
    },
    queryKey: cacheKeys.jobLogs(props),
  })

  return queryResult
}
