import {useEffect, useState} from 'react'
import {Box, Text} from 'ink'
import {DateTime} from 'luxon'
import Spinner from 'ink-spinner'

import {getJobStatusColor, getJobSummary} from '@cli/utils/index.js'
import {Job, JobStatus, Scalar} from '@cli/types.js'
import {useJobWatching} from '@cli/utils/hooks/index.js'
import {Title} from './Title.js'
import {StatusRow, StatusRowLabel} from './StatusTable.js'

interface JobStatusTableProps {
  projectId: string
  jobId: string
  isWatching: boolean
  onJobUpdate?: (job: Job) => void
}

const JobStatusSpinner = ({status, showSpinner}: {status: JobStatus; showSpinner: boolean}) => (
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
          <StatusRow label="ID" value={summary.id} />
          <StatusRow label="Name" value={job.project.name} />
          <Box flexDirection="row">
            <StatusRowLabel label="Status" />
            <JobStatusSpinner status={job.status} showSpinner={isWatching && !!isJobInProgress} />
          </Box>
          <StatusRow label="Version" value={summary.version} />
          <StatusRow label="Git Info" value={summary.gitInfo} />
          <StatusRow label="Platform" value={summary.platform} />
          <StatusRow label="Started At" value={summary.createdAt} />
          <StatusRow label="Runtime" value={summary.runtime} />
        </Box>
      )}
    </Box>
  )
}
