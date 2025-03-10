import {useEffect, useState} from 'react'
import {Box, Text} from 'ink'
import {DateTime} from 'luxon'
import Spinner from 'ink-spinner'

import {getBuildSummary, getJobStatusColor, getJobSummary, getStageColor} from '@cli/utils/index.js'
import {Job, JobStatus} from '@cli/types'
import {useJobWatching} from '@cli/utils/hooks/index.js'
import {Title} from './common/Title.js'
import {StatusRow, StatusRowLabel} from './common/StatusTable.js'

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
  const {data: job, stage, isLoading} = useJobWatching({projectId, jobId, isWatching, onJobUpdate})

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
  const buildSummary = job && job.build ? getBuildSummary(job.build) : null

  return (
    <Box flexDirection="row">
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
            <Box flexDirection="row">
              <StatusRowLabel label="Stage" />
              {stage && <Text color={getStageColor(stage)}>{`${stage}`}</Text>}
            </Box>
            <StatusRow label="Version" value={summary.version} />
            <StatusRow label="Git Info" value={summary.gitInfo} />
            <StatusRow label="Platform" value={summary.platform} />
            <StatusRow label="Started At" value={summary.createdAt} />
            <StatusRow label="Runtime" value={summary.runtime} />
          </Box>
        )}
      </Box>
      {buildSummary && (
        <Box flexDirection="column" marginBottom={1} marginLeft={3} borderStyle="single" padding={1}>
          <Title>Build Details</Title>
          <Box flexDirection="column" marginLeft={2}>
            <StatusRow label="ID" value={buildSummary.id} />
            <StatusRow label="Platform" value={buildSummary.platform} />
            <StatusRow label="Type" value={buildSummary.type} />
            <StatusRow label="CMD" value={buildSummary.cmd} />
          </Box>
        </Box>
      )}
    </Box>
  )
}
