import {useEffect} from 'react'
import {io} from 'socket.io-client'

import {cacheKeys, WS_URL} from '@cli/constants/index.js'

import {queryClient, arrayToDictionary, dictionaryToArray} from '@cli/utils/index.js'

import {CursorPaginatedResponse, Job, JobLogEntry} from '@cli/types.js'
import {getAuthToken} from '@cli/api/index.js'

export interface WebSocketListener {
  // What we listen to
  getPattern: () => string | string[]
  // What we run
  eventHandler: (pattern: string, data: any) => Promise<void>
}

export class JobLogListener implements WebSocketListener {
  constructor(private projectId: string, private jobId: string) {}
  getPattern() {
    return `project.${this.projectId}:job.${this.jobId}:log`
  }
  async eventHandler(pattern: string, logEntry: JobLogEntry) {
    // Update the react-query cache with the new Job Logs
    const keyProps = {projectId: this.projectId, jobId: this.jobId}
    const key = cacheKeys.jobLogs(keyProps)

    queryClient.setQueryData(key, (oldData: any) => {
      if (!oldData) return oldData // Not fetched?
      // Add new log entry to first page if not already there
      const firstPage: CursorPaginatedResponse<JobLogEntry> = oldData.pages[0]
      if (!firstPage) return oldData
      const otherPages = oldData.pages.slice(1)
      const pageById = arrayToDictionary(firstPage.data)
      if (Object.keys(pageById).includes(logEntry.id)) return oldData
      return {
        ...oldData,
        pages: [{...firstPage, data: [logEntry, ...firstPage.data]}, ...otherPages],
      }
    })
  }
}

export function useWebSocket(listeners: WebSocketListener[] = []) {
  const log = console.debug

  useEffect(() => {
    if (listeners.length === 0) {
      log('Not subscribing to WebSocket - no listeners')
      return
    }

    const token = getAuthToken()
    const socket = io(WS_URL, {
      auth: {token},
      forceNew: true,
    })

    socket.on('connect', () => log('Connected to WebSocket'))

    for (const listener of listeners) {
      const pattern = listener.getPattern()
      const bindSocket = (pattern: string) => {
        const boundListener = listener.eventHandler.bind(listener, pattern)
        log('Subscribing to', pattern)
        socket.on(pattern, boundListener)
      }
      if (Array.isArray(pattern)) return pattern.forEach(bindSocket)
      bindSocket(pattern)
    }

    return () => {
      log('Disconnecting from WebSocket')
      socket.disconnect()
    }
  }, [])
}
