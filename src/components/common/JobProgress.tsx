import {Box, Text} from 'ink'

import {JobLogLine, ProgressSpinner} from '@cli/components/index.js'
import {Job, JobLogEntry, LogLevel} from '@cli/types/api.js'
import {getMessageColor, getPlatformName, useJobWatching} from '@cli/utils/index.js'
import {useState} from 'react'

interface Props {
  job: Job
  onComplete?: (j: Job) => void
  onFailure?: (j: Job) => void
}

// Progress bar and spinner for a job
// If the job has a warning log entry, it will show the most recent warning
export const JobProgress = (props: Props) => {
  const [lastWarningLog, setLastWarningLog] = useState<JobLogEntry | null>(null)

  const {progress} = useJobWatching({
    isWatching: true,
    jobId: props.job.id,
    onComplete: props.onComplete,
    onFailure: props.onFailure,
    projectId: props.job.project.id,
    onNewLogEntry: (logEntry: JobLogEntry) => {
      if (logEntry.level == LogLevel.WARN) setLastWarningLog(logEntry)
    },
  })

  const label = `${getPlatformName(props.job.type)} build progress...`

  return (
    <Box flexDirection="column" gap={0}>
      <ProgressSpinner label={label} progress={progress} spinnerType="dots" />
      {lastWarningLog && (
        <Box flexDirection="row" gap={1} marginLeft={2}>
          <Text color={getMessageColor(lastWarningLog.level)}>WARNING</Text>
          <JobLogLine log={lastWarningLog} showTimestamp={false} showStage={false} />
        </Box>
      )}
    </Box>
  )
}
