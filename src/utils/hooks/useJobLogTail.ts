import {useEffect, useState} from 'react'

import {JobLogEntry} from '@cli/types.js'
import {useJobLogs} from '@cli/utils/query/useJobLogs.js'
import {useWebSocket, WebSocketListener} from './useWebSocket.js'
import {castObjectDates} from '../dates.js'
import {arrayToDictionary, dictionaryToArray} from '../dictionary.js'

export interface JobLogTailProps {
  projectId: string
  jobId: string
  length: number
  isWatching: boolean
}

export interface JobLogTailResult {
  isLoading: boolean
  data: JobLogEntry[]
}

// When received from the server the logs are not guaranteed to be in order
function getSortedJobLogs(logs: JobLogEntry[]) {
  return logs.sort((a, b) => a.sentAt.toMillis() - b.sentAt.toMillis())
}

// Merges fetched job logs with those received from the websocket
export function useJobLogTail(props: JobLogTailProps): JobLogTailResult {
  const [websocketLogs, setWebsocketLogs] = useState<JobLogEntry[]>([])

  // Updates our state with logs received from the websocket
  const listener: WebSocketListener = {
    getPattern: () => `project.${props.projectId}:job.${props.jobId}:log`,
    eventHandler: async (pattern: string, rawLogEntry: any) => {
      setWebsocketLogs((prevLogs) => {
        const logEntry = castObjectDates<JobLogEntry>(rawLogEntry, ['sentAt', 'createdAt'])
        return [...prevLogs, logEntry]
      })
    },
  }

  useWebSocket(props.isWatching ? [listener] : [])

  const {isLoading, data: fetchedJobLogs} = useJobLogs({
    projectId: props.projectId,
    jobId: props.jobId,
    pageSize: props.length,
  })

  useEffect(() => {
    // Reset the websocket data when we refetch
    setWebsocketLogs([])
  }, [props.jobId, props.projectId, props.length, props.isWatching, fetchedJobLogs])

  // We only use the first page of the infinite query
  const firstPage = fetchedJobLogs ? fetchedJobLogs?.pages[0].data : []

  // Deduplicate merged logs by id
  const allLogs = [...firstPage, ...websocketLogs]
  const allLogsById = arrayToDictionary<JobLogEntry>(allLogs)
  const uniqueLogs = dictionaryToArray(allLogsById)

  const data = getSortedJobLogs(uniqueLogs).slice(-props.length)

  return {
    isLoading,
    data,
  }
}
