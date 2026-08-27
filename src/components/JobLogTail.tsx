import {Box} from 'ink'
import Spinner from 'ink-spinner'
import {useEffect} from 'react'

import {JobLogEntry} from '@cli/types'
import {JobLogTailProps, useJobLogTail} from '@cli/utils/hooks/index.js'

import {JobLogLine} from './common/JobLogLine.js'
import {Title} from './common/Title.js'

interface Props extends JobLogTailProps {
  // Says that the first page has arrived, so a caller that exits can wait for it
  onLoaded?: () => void
  // The title names the job when more than one tail is on screen
  title?: string
}

export const JobLogTail = ({onLoaded, title = 'Job Logs', ...props}: Props) => {
  const {data, isLoading} = useJobLogTail(props)

  useEffect(() => {
    if (!isLoading) onLoaded?.()
  }, [isLoading])

  return (
    <Box flexDirection="column">
      <Title>{title}</Title>
      {isLoading && <Spinner type="dots" />}
      <Box flexDirection="column">
        {data.map((log: JobLogEntry) => (
          <JobLogLine key={log.id} log={log} />
        ))}
      </Box>
    </Box>
  )
}
