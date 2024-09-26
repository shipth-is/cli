import {useEffect, useState} from 'react'
import {Box, Text} from 'ink'
import {DateTime} from 'luxon'
import Spinner from 'ink-spinner'

import {getJobStatusColor, getJobSummary} from '@cli/utils/index.js'
import {Job, JobStatus, Scalar} from '@cli/types.js'
import {useJobWatching} from '@cli/utils/hooks/index.js'
import {Title} from './Title.js'

interface JobStatusTableProps {
  projectId: string
  jobId: string
  isWatching: boolean
  onJobUpdate?: (job: Job) => void
}

const DetailsRowLabel = ({label}: {label: string}) => (
  <Box width={15}>
    <Text>{`${label}: `}</Text>
  </Box>
)

const DetailsRow = ({label, value}: {label: string; value: Scalar}) => {
  return (
    <Box flexDirection="row" alignItems="flex-end">
      <DetailsRowLabel label={label} />
      <Text bold>{value}</Text>
    </Box>
  )
}

const StatusValue = ({status, showSpinner}: {status: JobStatus; showSpinner: boolean}) => (
  <>
    <Text color={getJobStatusColor(status)}>{`${status}`}</Text>
    {showSpinner && (
      <>
        <Text> </Text>
        <Spinner type="dots" />
      </>
    )}
  </>
)

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

  const summary = job ? getJobSummary(job, time) : null

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Title>Job Details</Title>
      {isLoading && <Spinner type="dots" />}
      {summary && job && (
        <Box flexDirection="column" marginLeft={2}>
          <DetailsRow label="ID" value={summary.id} />
          <DetailsRow label="Name" value={job.project.name} />
          <Box flexDirection="row">
            <DetailsRowLabel label="Status" />
            <StatusValue status={job.status} showSpinner={isWatching && !!isJobInProgress} />
          </Box>
          <DetailsRow label="Version" value={summary.version} />
          <DetailsRow label="Git Info" value={summary.gitInfo} />
          <DetailsRow label="Platform" value={summary.platform} />
          <DetailsRow label="Started At" value={summary.createdAt} />
          <DetailsRow label="Runtime" value={summary.runtime} />
        </Box>
      )}
    </Box>
  )
}
