import {Box, Text} from 'ink'
import {useJobLogs} from '@cli/utils/query/index.js'
import Spinner from 'ink-spinner'
import {getShortDateTime} from '@cli/utils/dates.js'
import {Table} from './Table.js'

export interface JobLogTailProps {
  projectId: string
  jobId: string
}

export const JobLogTail = ({jobId, projectId}: JobLogTailProps) => {
  const {isLoading, data} = useJobLogs({projectId, jobId})

  const rawData = !data ? [] : data.pages.map((page) => page.data).flat()
  const tableData = rawData.map((log) => {
    return {
      time: getShortDateTime(log.sentAt),
      stage: log.stage,
      level: log.level, // TODO: colorize?
      message: log.message,
    }
  })

  return (
    <Box flexDirection="column">
      <Text bold>JOB LOGS</Text>
      {isLoading && <Spinner type="dots" />}
      <Table data={tableData} />
    </Box>
  )
}
