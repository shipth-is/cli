import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'

import {getMessageColor, getStageColor, getShortTime} from '@cli/utils/index.js'
import {JobLogEntry, JobStage} from '@cli/types.js'
import {JobLogTailProps, useJobLogTail} from '@cli/utils/hooks/index.js'
import {Title} from './Title.js'

export const JobLogTail = (props: JobLogTailProps) => {
  const {isLoading, data} = useJobLogTail(props)

  return (
    <Box flexDirection="column">
      <Title>Job Logs</Title>
      {isLoading && <Spinner type="dots" />}
      <Box flexDirection="column">
        {data.map((log: JobLogEntry) => {
          const stageColor = getStageColor(log.stage)
          const messageColor = getMessageColor(log.level)
          return (
            <Box key={log.id} flexDirection="row" overflow="hidden" height={1}>
              <Box width={JobStage.CONFIGURE.length} justifyContent="flex-start">
                <Text color={stageColor}>{log.stage}</Text>
              </Box>
              <Box marginLeft={1}>
                <Text>{getShortTime(log.sentAt)}</Text>
              </Box>
              <Box marginLeft={1} overflow="hidden" height={1} marginRight={2}>
                <Text wrap="truncate-middle" color={messageColor}>
                  {log.message.replaceAll(/[\r\n]/g, '')}
                </Text>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
