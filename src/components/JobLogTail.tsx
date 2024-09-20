import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'

import {getMessageColor, getStageColor, getShortTime} from '@cli/utils/index.js'
import {JobLogEntry} from '@cli/types.js'
import {JobLogTailProps, useJobLogTail} from '@cli/utils/hooks/index.js'

export const JobLogTail = (props: JobLogTailProps) => {
  const {isLoading, data} = useJobLogTail(props)

  return (
    <Box flexDirection="column">
      <Text bold>JOB LOGS</Text>
      {isLoading && <Spinner type="dots" />}
      <Box flexDirection="column">
        {data.map((log: JobLogEntry) => {
          const stageColor = getStageColor(log.stage)
          const messageColor = getMessageColor(log.level)
          return (
            <Box key={log.id} flexDirection="row" overflow="hidden">
              <Text color={stageColor}>{log.stage}</Text>
              <Text> </Text>
              <Text>{getShortTime(log.sentAt)}</Text>
              <Text> </Text>
              <Text color={messageColor}>{log.message.replace(/[\r\n]/g, '')}</Text>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
