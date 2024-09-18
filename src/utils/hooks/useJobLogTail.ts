import {useEffect, useState} from 'react'

import {JobLogEntry} from '@cli/types.js'
import {useJobLogs} from '@cli/utils/query/useJobLogs.js'
import {useWebSocket, WebSocketListener} from './useWebSocket.js'

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
  return logs.sort((a, b) => {
    if (a.sentAt < b.sentAt) {
      return -1
    } else if (a.sentAt > b.sentAt) {
      return 1
    } else {
      return 0
    }
  })
}

// Merges fetched job logs with those received from the websocket
export function useJobLogTail(props: JobLogTailProps): JobLogTailResult {
  const [websocketLogs, setWebsocketLogs] = useState<JobLogEntry[]>([])

  const listener: WebSocketListener = {
    getPattern: () => `project.${props.projectId}:job.${props.jobId}:log`,
    eventHandler: async (pattern: string, logEntry: JobLogEntry) => {
      setWebsocketLogs((prevLogs) => {
        return getSortedJobLogs([...prevLogs, logEntry])
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
    setWebsocketLogs([])
  }, [props.jobId, props.projectId, props.length, props.isWatching, fetchedJobLogs])

  // We only use the first page of the infinite query
  const firstPage = fetchedJobLogs ? fetchedJobLogs?.pages[0].data : []
  const data = getSortedJobLogs([...firstPage, ...websocketLogs]).slice(-props.length)

  return {
    isLoading,
    data,
  }
}
