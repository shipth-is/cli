import {Job} from '@cli/types.js'
import {useJob} from '@cli/utils/query/useJob.js'
import {useEffect, useState} from 'react'
import {useWebSocket, WebSocketListener} from './useWebSocket.js'
import {castObjectDates} from '@cli/utils/dates.js'

export interface JobWatchingProps {
  projectId: string
  jobId: string
  isWatching: boolean
}

export interface JobWatchingResult {
  isLoading: boolean
  data: Job | null
}

// Like useJob but also listens for job updates via websocket
export function useJobWatching(props: JobWatchingProps): JobWatchingResult {
  const [websocketJob, setWebsocketJob] = useState<Job | null>(null)

  const listener: WebSocketListener = {
    getPattern: () => [`project.${props.projectId}:job:created`, `project.${props.projectId}:job:updated`],
    eventHandler: async (pattern: string, rawJob: Job) => {
      if (rawJob.id !== props.jobId) return
      // We have to fix the dates
      const job = castObjectDates<Job>(rawJob)
      setWebsocketJob(job)
    },
  }
  useWebSocket(props.isWatching ? [listener] : [])

  const {isLoading, data: job} = useJob({projectId: props.projectId, jobId: props.jobId})

  useEffect(() => {
    setWebsocketJob(null)
  }, [props.jobId, props.projectId, props.isWatching, job])

  const fetched = job ? job : null

  const data = websocketJob ? websocketJob : fetched

  return {
    isLoading,
    data,
  }
}
