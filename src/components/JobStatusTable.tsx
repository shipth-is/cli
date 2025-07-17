import {Job, JobStatus} from '@cli/types'
import {useJobWatching} from '@cli/utils/hooks/index.js'
import {getJobStatusColor, getJobSummary, getStageColor} from '@cli/utils/index.js'
import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import {DateTime} from 'luxon'
import {useEffect, useState} from 'react'

import {StatusRow, StatusRowLabel} from './common/StatusTable.js'
import {Title} from './common/Title.js'

interface JobStatusTableProps {
  isWatching: boolean
  jobId: string
  onJobUpdate?: (job: Job) => void
  projectId: string
}

const JobStatusSpinner = ({showSpinner, status}: {showSpinner: boolean; status: JobStatus}) => (
  <>
    <Box width={JobStatus.PROCESSING.length}>
      <Text color={getJobStatusColor(status)}>{`${status}`}</Text>
    </Box>
    {showSpinner && (
      <>
        <Text> </Text>
        <Spinner type="dots" />
      </>
    )}
  </>
)

export const JobStatusTable = ({isWatching, jobId, onJobUpdate, projectId}: JobStatusTableProps) => {
  const {data: job, isLoading, stage} = useJobWatching({isWatching, jobId, onJobUpdate, projectId})

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
    <Box flexDirection="row">
      <Box flexDirection="column" marginBottom={1}>
        <Title>Job Details</Title>
        {isLoading && <Spinner type="dots" />}
        {summary && job && (
          <Box flexDirection="row">
            <Box flexDirection="column" marginLeft={2}>
              <StatusRow label="ID" value={summary.id} />
              <StatusRow label="Platform" value={summary.platform} />
              <Box flexDirection="row">
                <StatusRowLabel label="Status" />
                <JobStatusSpinner showSpinner={isWatching && Boolean(isJobInProgress)} status={job.status} />
              </Box>
              <Box flexDirection="row">
                <StatusRowLabel label="Stage" />
                {stage && <Text color={getStageColor(stage)}>{`${stage}`}</Text>}
              </Box>
            </Box>
            <Box flexDirection="column" marginLeft={2}>
              <StatusRow label="Version" value={summary.version} />
              <StatusRow label="Git Info" value={summary.gitInfo} />
              <StatusRow label="Started At" value={summary.createdAt} />
              <StatusRow label="Runtime" value={summary.runtime} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
