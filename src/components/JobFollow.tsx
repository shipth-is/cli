import {Job, JobLogEntry, LogLevel} from '@cli/types/api.js'
import {useJobWatching} from '@cli/utils/index.js'
import { useStderr, useStdout } from 'ink'

interface JobFollowProps {
  jobId: string
  onComplete?: (job: Job) => void
  onFailure?: (job: Job) => void
  projectId: string
}

// Outputs job logs to stdout/stderr as they come in
export const JobFollow = ({
  jobId,
  onComplete,
  onFailure,
  projectId,
}: JobFollowProps) => {
  const {stdout, write: writeOut} = useStdout();
  const {stderr, write: writeErr} = useStderr();

  // Only emit ANSI when we're actually writing to a TTY.
  const useAnsi = Boolean((stderr as any).isTTY ?? (stdout as any).isTTY);

  const yellow = useAnsi ? '\x1b[33m' : '';
  const red = useAnsi ? '\x1b[31m' : '';
  const reset = useAnsi ? '\x1b[0m' : '';

  useJobWatching({
    isWatching: true,
    jobId,
    onComplete,
    onFailure,
    onNewLogEntry(logEntry: JobLogEntry) {
      const msg = logEntry.message + '\n';

      if (logEntry.level === LogLevel.ERROR) {
        writeErr(`${red}${msg}${reset}`);
      } else if (logEntry.level === LogLevel.WARN) {
        writeErr(`${yellow}${msg}${reset}`);
      } else {
        writeOut(msg);
      }
    },
    projectId,
  });

  return null;
};