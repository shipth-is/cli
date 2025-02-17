import {useRef} from 'react'

import {Job, JobStatus} from '@cli/types/api.js'
import {useJobWatching} from '@cli/utils/index.js'
import {ProgressSpinner} from '@cli/components/index.js'

interface Props {
  job: Job
  onComplete: () => void
}

export const JobProgress = (props: Props) => {
  const prevJobStatus = useRef<JobStatus>(props.job.status)

  const handleJobUpdate = (job: Job) => {
    const completed = [JobStatus.COMPLETED, JobStatus.FAILED]
    const wasRunning = !completed.includes(prevJobStatus.current)
    if (completed.includes(job.status) && wasRunning) {
      props.onComplete()
    }
    prevJobStatus.current = job.status
  }

  const {progress} = useJobWatching({
    projectId: props.job.project.id,
    jobId: props.job.id,
    isWatching: true,
    onJobUpdate: handleJobUpdate,
  })

  return (
    <>
      <ProgressSpinner progress={progress} label="Job progress..." spinnerType="dots" />
    </>
  )
}
