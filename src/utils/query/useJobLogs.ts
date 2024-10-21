import axios, {AxiosError} from 'axios'
import {InfiniteData, useInfiniteQuery, UseInfiniteQueryResult} from '@tanstack/react-query'

import {castArrayObjectDates} from '@cli/utils/index.js'
import {cacheKeys} from '@cli/constants/cacheKeys.js'
import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL} from '@cli/constants/index.js'
import {CursorPaginatedResponse, JobLogEntry} from '@cli/types'

export interface JobLogsQueryProps {
  projectId: string
  jobId: string
  cursor?: string
  pageSize?: number
}

export type JobLogsQueryResponse = CursorPaginatedResponse<JobLogEntry>

export async function queryJobLogs({
  projectId,
  jobId,
  cursor,
  pageSize = 10,
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
    queryKey: cacheKeys.jobLogs(props),
    queryFn: async ({pageParam}) => {
      return queryJobLogs({
        ...props,
        cursor: pageParam as string,
      })
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: props.cursor,
  })

  return queryResult
}
