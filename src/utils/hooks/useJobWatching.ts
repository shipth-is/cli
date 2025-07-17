import {useEffect, useRef, useState} from 'react'

import {Job, JobLogEntry, JobStage, JobStatus} from '@cli/types'
import {castJobDates, castObjectDates} from '@cli/utils/dates.js'
import {useJob} from '@cli/utils/query/useJob.js'

import {WebSocketListener, useWebSocket} from './useWebSocket.js'

export interface JobWatchingProps {
  isWatching: boolean
  jobId: string
  onComplete?: (j: Job) => void
  onFailure?: (j: Job) => void
  onJobUpdate?: (job: Job) => void
  onNewLogEntry?: (logEntry: JobLogEntry) => void
  projectId: string
}

export interface JobWatchingResult {
  data: Job | null
  isLoading: boolean
  progress: null | number
  stage: JobStage | null
}

// Like useJob but also listens for job updates via websocket
export function useJobWatching({
  isWatching,
  jobId,
  onComplete,
  onFailure,
  onJobUpdate,
  onNewLogEntry,
  projectId,
}: JobWatchingProps): JobWatchingResult {
  const [websocketJob, setWebsocketJob] = useState<Job | null>(null)
  const [mostRecentLog, setMostRecentLog] = useState<JobLogEntry | null>(null)

  const prevJobStatus = useRef<JobStatus>(JobStatus.PENDING)

  const handleJobUpdate = (job: Job) => {
    const completed = new Set([JobStatus.COMPLETED, JobStatus.FAILED])
    const wasRunning = !completed.has(prevJobStatus.current)
    if (completed.has(job.status) && wasRunning) {
      if (job.status === JobStatus.FAILED) {
        onFailure && onFailure(job)
      } else {
        onComplete && onComplete(job)
      }
    }

    prevJobStatus.current = job.status
  }

  const jobStatusListener: WebSocketListener = {
    async eventHandler(pattern: string, rawJob: any) {
      if (rawJob.id !== jobId) return
      const job = castJobDates(rawJob)
      setWebsocketJob(job)
      handleJobUpdate(job)
      if (onJobUpdate) onJobUpdate(job)
    },
    getPattern: () => [`project.${projectId}:job:created`, `project.${projectId}:job:updated`],
  }

  const jobProgressListener: WebSocketListener = {
    async eventHandler(pattern: string, rawLogEntry: any) {
      const logEntry = castObjectDates<JobLogEntry>(rawLogEntry, ['sentAt', 'createdAt'])
      if (onNewLogEntry) onNewLogEntry(logEntry)
      setMostRecentLog(logEntry)
    },
    getPattern: () => `project.${projectId}:job.${jobId}:log`,
  }

  useWebSocket(isWatching ? [jobStatusListener, jobProgressListener] : [])

  const {data: job, isLoading} = useJob({
    jobId,
    projectId,
  })

  useEffect(() => {
    setWebsocketJob(null)
  }, [jobId, projectId, isWatching, job])

  const fetchedJob = job ? job : null
  const data = websocketJob ? websocketJob : fetchedJob
  const progress = mostRecentLog?.progress || null
  const stage = mostRecentLog?.stage || null

  return {
    data,
    isLoading,
    progress,
    stage,
  }
}
