import {Box, Text} from 'ink'

import {JobLogEntry} from '@cli/types'
import {getMessageColor, getShortTime, getStageColor} from '@cli/utils/index.js'

import {TruncatedText} from './TruncatedText.js'

interface Props {
  log: JobLogEntry
  showTimestamp?: boolean
  showStage?: boolean
}

// A single line in a job log
export const JobLogLine = ({log, showTimestamp = true, showStage = true}: Props) => {
  const stageColor = getStageColor(log.stage)
  const messageColor = getMessageColor(log.level)
  return (
    <Box flexDirection="row" height={1} key={log.id} overflow="hidden" gap={1}>
      {showTimestamp && (
        <Box>
          <Text>{getShortTime(log.sentAt)}</Text>
        </Box>
      )}
      {showStage && (
        <Box justifyContent="flex-start" width={9}>
          <Text color={stageColor}>{log.stage}</Text>
        </Box>
      )}
      <Box height={1} marginRight={2} overflow="hidden">
        <TruncatedText color={messageColor}>{log.message}</TruncatedText>
      </Box>
    </Box>
  )
}
