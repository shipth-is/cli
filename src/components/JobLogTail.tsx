import {Box} from 'ink'
import Spinner from 'ink-spinner'

import {JobLogEntry} from '@cli/types'
import {JobLogTailProps, useJobLogTail} from '@cli/utils/hooks/index.js'

import {Title} from './common/Title.js'

import {JobLogLine} from './common/JobLogLine.js'

export const JobLogTail = (props: JobLogTailProps) => {
  const {data, isLoading} = useJobLogTail(props)

  return (
    <Box flexDirection="column">
      <Title>Job Logs</Title>
      {isLoading && <Spinner type="dots" />}
      <Box flexDirection="column">
        {data.map((log: JobLogEntry) => (
          <JobLogLine key={log.id} log={log} />
        ))}
      </Box>
    </Box>
  )
}
