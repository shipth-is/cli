import {JobLogEntry} from '@cli/types'
import {JobLogTailProps, useJobLogTail} from '@cli/utils/hooks/index.js'
import {getMessageColor, getShortTime, getStageColor} from '@cli/utils/index.js'
import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'

import {Title} from './common/Title.js'
import {TruncatedText} from './common/TruncatedText.js'

export const JobLogTail = (props: JobLogTailProps) => {
  const {data, isLoading} = useJobLogTail(props)

  // TODO: the <TruncatedText> is causing issues
  return (
    <Box flexDirection="column">
      <Title>Job Logs</Title>
      {isLoading && <Spinner type="dots" />}
      <Box flexDirection="column">
        {data.map((log: JobLogEntry) => {
          const stageColor = getStageColor(log.stage)
          const messageColor = getMessageColor(log.level)
          return (
            <Box flexDirection="row" height={1} key={log.id} overflow="hidden">
              <Box>
                <Text>{getShortTime(log.sentAt)}</Text>
              </Box>
              <Box justifyContent="flex-start" marginLeft={1} width={9}>
                <Text color={stageColor}>{log.stage}</Text>
              </Box>
              <Box height={1} marginLeft={1} marginRight={2} overflow="hidden">
                <TruncatedText color={messageColor}>{log.message}</TruncatedText>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
