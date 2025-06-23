import {Job, JobLogEntry, LogLevel} from '@cli/types/api.js'
import {useJobWatching} from '@cli/utils/index.js'

interface JobFollowProps {
  projectId: string
  jobId: string
  onComplete?: (job: Job) => void
  onFailure?: (job: Job) => void
}

// Outputs job logs to stdout/stderr as they come in
export const JobFollow = ({projectId, jobId, onComplete, onFailure}: JobFollowProps) => {
  useJobWatching({
    projectId,
    jobId,
    isWatching: true,
    onNewLogEntry: (logEntry: JobLogEntry) => {
      if (logEntry.level == LogLevel.ERROR) console.error(logEntry.message)
      else console.log(logEntry.message)
    },
    onComplete,
    onFailure,
  })

  return null
}
