import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'

import {getJobStatusColor, getShortDate, getShortTime, getShortTimeDelta} from '@cli/utils/index.js'
import {JobStatus} from '@cli/types.js'
import {useJobWatching} from '@cli/utils/hooks/index.js'

interface JobStatusTableProps {
  projectId: string
  jobId: string
  isWatching: boolean
}

export const JobStatusTable = ({jobId, projectId, isWatching}: JobStatusTableProps) => {
  const {data: job, isLoading} = useJobWatching({projectId, jobId, isWatching})

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold>JOB DETAILS</Text>
      {isLoading && <Spinner type="dots" />}
      {job && (
        <Box flexDirection="column" marginLeft={2}>
          <Text>{`ID: ${job.id}`}</Text>
          <Box flexDirection="row">
            <Text>{`Status: `}</Text>
            <Text color={getJobStatusColor(job.status)}>{`${job.status}`}</Text>
          </Box>
          <Text>{`Started At: ${getShortTime(job.createdAt, {fractionalSecondDigits: 3})}`}</Text>
          <Text>{`Ended At: ${
            job.status === JobStatus.COMPLETED ? getShortTime(job.updatedAt, {fractionalSecondDigits: 3}) : 'N/A'
          }`}</Text>
          <Text>{`Runtime: ${getShortTimeDelta(job.createdAt, job.updatedAt)}`}</Text>
        </Box>
      )}
    </Box>
  )
}
