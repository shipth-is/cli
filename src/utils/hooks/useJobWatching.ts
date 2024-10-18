import {Job} from '@cli/types.js'
import {useJob} from '@cli/utils/query/useJob.js'
import {useEffect, useState} from 'react'
import {useWebSocket, WebSocketListener} from './useWebSocket.js'
import {castJobDates} from '@cli/utils/dates.js'

export interface JobWatchingProps {
  projectId: string
  jobId: string
  isWatching: boolean
  onJobUpdate?: (job: Job) => void
}

export interface JobWatchingResult {
  isLoading: boolean
  data: Job | null
}

// Like useJob but also listens for job updates via websocket
export function useJobWatching({projectId, jobId, isWatching, onJobUpdate}: JobWatchingProps): JobWatchingResult {
  const [websocketJob, setWebsocketJob] = useState<Job | null>(null)

  const listener: WebSocketListener = {
    getPattern: () => [`project.${projectId}:job:created`, `project.${projectId}:job:updated`],
    eventHandler: async (pattern: string, rawJob: any) => {
      if (rawJob.id !== jobId) return
      const job = castJobDates(rawJob)
      setWebsocketJob(job)
      if (onJobUpdate) onJobUpdate(job)
    },
  }
  useWebSocket(isWatching ? [listener] : [])

  const {isLoading, data: job} = useJob({
    projectId,
    jobId,
  })

  useEffect(() => {
    setWebsocketJob(null)
  }, [jobId, projectId, isWatching, job])

  const fetchedJob = job ? job : null
  const data = websocketJob ? websocketJob : fetchedJob

  return {
    isLoading,
    data,
  }
}
