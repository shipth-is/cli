import {useRef, useState} from 'react'

import {Job, JobStatus} from '@cli/types'
import {castJobDates} from '@cli/utils/dates.js'
import {WebSocketListener, useWebSocket} from './useWebSocket.js'

export interface ProjectJobListenerProps {
  projectId: string
  onJobCreated?: (j: Job) => void
  onJobUpdated?: (j: Job) => void
  onJobCompleted?: (j: Job) => void
  onJobFailed?: (j: Job) => void
}

type JobsById = Record<string, Job>
type JobStatusById = Record<string, JobStatus>

export interface ProjectJobListenerResult {
  jobsById: JobsById
}

// Listens for all job updates related to a specific project.
// Does not need a jobId
export function useProjectJobListener({
  projectId,
  onJobCreated,
  onJobUpdated,
  onJobCompleted,
  onJobFailed,
}: ProjectJobListenerProps): ProjectJobListenerResult {
  const [jobsById, setJobsById] = useState<JobsById>({})
  const prevJobStatuses = useRef<JobStatusById>({})

  const handleJobUpdate = (job: Job) => {
    const completed = new Set([JobStatus.COMPLETED, JobStatus.FAILED])
    const wasRunning = !completed.has(prevJobStatuses.current[job.id])
    if (completed.has(job.status) && wasRunning) {
      if (job.status === JobStatus.FAILED) {
        onJobFailed && onJobFailed(job)
      } else {
        onJobCompleted && onJobCompleted(job)
      }
    }
    prevJobStatuses.current[job.id] = job.status
  }

  const jobCreatedListener: WebSocketListener = {
    async eventHandler(pattern: string, rawJob: any) {
      const job = castJobDates(rawJob)
      setJobsById((prev) => ({...prev, [job.id]: job}))
      if (onJobCreated) onJobCreated(job)
    },
    getPattern: () => [`project.${projectId}:job:created`],
  }

  const jobUpdatedListener: WebSocketListener = {
    async eventHandler(pattern: string, rawJob: any) {
      const job = castJobDates(rawJob)
      setJobsById((prev) => ({...prev, [job.id]: job}))
      if (onJobUpdated) onJobUpdated(job)
      handleJobUpdate(job)
    },
    getPattern: () => [`project.${projectId}:job:updated`],
  }

  useWebSocket([jobCreatedListener, jobUpdatedListener])

  return {jobsById}
}
