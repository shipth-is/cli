import {useEffect, useState} from 'react'

import {JobLogEntry} from '@cli/types'
import {useJobLogs} from '@cli/utils/query/useJobLogs.js'

import {arrayToDictionary, dictionaryToArray} from '../dictionary.js'

import {useJobWatching} from './useJobWatching.js'

export interface JobLogTailProps {
  isWatching: boolean
  jobId: string
  length: number
  projectId: string
}

export interface JobLogTailResult {
  data: JobLogEntry[]
  isLoading: boolean
}

// When received from the server the logs are not guaranteed to be in order
function getSortedJobLogs(logs: JobLogEntry[]) {
  return [...logs].sort((a, b) => {
    // Prefer producer sequence when available
    if (a.sequence != null && b.sequence != null) {
      return a.sequence - b.sequence
    }
    // Fallback to time-based ordering
    return a.sentAt.toMillis() - b.sentAt.toMillis()
  })
}
// Merges fetched job logs with those received from the websocket
export function useJobLogTail({isWatching, jobId, length, projectId}: JobLogTailProps): JobLogTailResult {
  const [websocketLogs, setWebsocketLogs] = useState<JobLogEntry[]>([])

  // Updates our state with logs received from the websocket
  useJobWatching({
    isWatching,
    jobId,
    onNewLogEntry(logEntry: JobLogEntry) {
      setWebsocketLogs((prevLogs) => [...prevLogs, logEntry])
    },
    projectId,
  })

  const {data: fetchedJobLogs, isLoading} = useJobLogs({
    jobId,
    pageSize: length,
    projectId,
  })

  useEffect(() => {
    // Reset the websocket data when we refetch
    setWebsocketLogs([])
  }, [jobId, projectId, length, isWatching, fetchedJobLogs])

  // We only use the first page of the infinite query
  const firstPage = fetchedJobLogs ? fetchedJobLogs?.pages[0].data : []

  // Deduplicate merged logs by id
  const allLogs = [...firstPage, ...websocketLogs]
  const allLogsById = arrayToDictionary<JobLogEntry>(allLogs)
  const uniqueLogs = dictionaryToArray(allLogsById)

  const data = getSortedJobLogs(uniqueLogs).slice(-length)

  return {
    data,
    isLoading,
  }
}
