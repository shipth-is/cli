import {Job, JobLogEntry, LogLevel} from '@cli/types/api.js'
import {useJobWatching} from '@cli/utils/index.js'

interface JobFollowProps {
  jobId: string
  onComplete?: (job: Job) => void
  onFailure?: (job: Job) => void
  projectId: string
}

// Outputs job logs to stdout/stderr as they come in
export const JobFollow = ({jobId, onComplete, onFailure, projectId}: JobFollowProps) => {
  useJobWatching({
    isWatching: true,
    jobId,
    onComplete,
    onFailure,
    onNewLogEntry(logEntry: JobLogEntry) {
      if (logEntry.level == LogLevel.ERROR) console.error(logEntry.message)
      else console.log(logEntry.message)
    },
    projectId,
  })

  return null
}
