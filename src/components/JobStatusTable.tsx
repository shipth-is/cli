import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'

import {useJob} from '@cli/utils/query/index.js'

import {getShortDate, getShortTimeDelta} from '@cli/utils/index.js'
import {JobStatus} from '@cli/types.js'

interface JobStatusTableProps {
  projectId: string
  jobId: string
}

export const JobStatusTable = ({jobId, projectId}: JobStatusTableProps) => {
  const {data: job, isLoading} = useJob({projectId, jobId})

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold>JOB DETAILS</Text>
      {isLoading && <Spinner type="dots" />}
      {job && (
        <Box flexDirection="column" marginLeft={2}>
          <Text>{`ID: ${job.id}`}</Text>
          <Text>{`Status: ${job.status}`}</Text>
          <Text>{`Started At: ${getShortDate(job.createdAt)}`}</Text>
          <Text>{`Ended At: ${job.status === JobStatus.COMPLETED ? getShortDate(job.updatedAt) : 'N/A'}`}</Text>
          <Text>{`Runtime: ${getShortTimeDelta(job.createdAt, job.updatedAt)}`}</Text>
        </Box>
      )}
    </Box>
  )
}
