import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'

import {getMessageColor, getStageColor, getShortTime} from '@cli/utils/index.js'
import {JobLogEntry} from '@cli/types'
import {JobLogTailProps, useJobLogTail} from '@cli/utils/hooks/index.js'
import {Title} from './common/Title.js'
import {TruncatedText} from './common/TruncatedText.js'

export const JobLogTail = (props: JobLogTailProps) => {
  const {isLoading, data} = useJobLogTail(props)

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
            <Box key={log.id} flexDirection="row" overflow="hidden" height={1}>
              <Box>
                <Text>{getShortTime(log.sentAt)}</Text>
              </Box>
              <Box marginLeft={1} width={9} justifyContent="flex-start">
                <Text color={stageColor}>{log.stage}</Text>
              </Box>
              <Box marginLeft={1} overflow="hidden" height={1} marginRight={2}>
                <TruncatedText color={messageColor}>{log.message}</TruncatedText>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
