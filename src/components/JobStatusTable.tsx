import {useEffect, useState} from 'react'
import {Box, Text} from 'ink'
import {DateTime} from 'luxon'
import Spinner from 'ink-spinner'

import {getJobStatusColor, getShortTime, getShortTimeDelta, getShortUUID} from '@cli/utils/index.js'
import {Job, JobStatus} from '@cli/types.js'
import {useJobWatching} from '@cli/utils/hooks/index.js'
import {Title} from './Title.js'

interface JobStatusTableProps {
  projectId: string
  jobId: string
  isWatching: boolean
  onJobUpdate?: (job: Job) => void
}

export const JobStatusTable = ({jobId, projectId, isWatching, onJobUpdate}: JobStatusTableProps) => {
  const {data: job, isLoading} = useJobWatching({projectId, jobId, isWatching, onJobUpdate})

  const [time, setTime] = useState(DateTime.now())

  useEffect(() => {
    if (!isWatching) return
    const interval = setInterval(() => setTime(DateTime.now()), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const isJobInProgress = job && ![JobStatus.COMPLETED, JobStatus.FAILED].includes(job.status)
  const runtime = job ? getShortTimeDelta(job.createdAt, isJobInProgress ? time : job.updatedAt) : 'N/A'

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Title>Job Details</Title>
      {isLoading && <Spinner type="dots" />}
      {job && (
        <Box flexDirection="column" marginLeft={2}>
          <Text>{`ID: ${getShortUUID(job.id)}`}</Text>
          <Box flexDirection="row">
            <Text>{`Status: `}</Text>
            <Text color={getJobStatusColor(job.status)}>{`${job.status}`}</Text>
            {isWatching && isJobInProgress && (
              <>
                <Text> </Text>
                <Spinner type="dots" />
              </>
            )}
          </Box>
          <Text>{`Started At: ${getShortTime(job.createdAt)}`}</Text>
          <Text>{`Ended At: ${job.status === JobStatus.COMPLETED ? getShortTime(job.updatedAt) : 'N/A'}`}</Text>
          <Text>{`Runtime: ${runtime}`}</Text>
        </Box>
      )}
    </Box>
  )
}
