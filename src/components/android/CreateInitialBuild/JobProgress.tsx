import {Box, Text} from 'ink'
import {ProgressBar} from '@inkjs/ui'
import {useRef} from 'react'
import Spinner from 'ink-spinner'

import {Job, JobStatus} from '@cli/types/api.js'
import {useJobWatching} from '@cli/utils/index.js'

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
      <Box flexDirection="column" gap={1}>
        <Text>Job progress</Text>
        <Box flexDirection="row" gap={1}>
          <ProgressBar value={progress || 0} />
          <Text>{Math.floor(progress || 0)}%</Text>
          <Spinner type="dots" />
        </Box>
      </Box>
    </>
  )
}
