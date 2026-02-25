import {Box, Text} from 'ink'
import {useContext, useEffect, useState} from 'react'

import {CommandContext, GameContext, JobFollow, JobLogTail, JobProgress, JobStatusTable} from '@cli/components/index.js'
import {Job, JobStatus, ShipGameFlags} from '@cli/types/index.js'
import {useProjectJobListener, useStartShipOnMount} from '@cli/utils/hooks/index.js'

import {KeyboardShortcuts} from './KeyboardShortcuts.js'
import {ShipResult} from './ShipResult.js'

interface Props {
  onComplete: (completedJobs: Job[]) => void
  onError: (error: any) => void
}

export const Ship = ({onComplete, onError}: Props): JSX.Element | null => {
  const {command} = useContext(CommandContext)
  const {gameId} = useContext(GameContext)
  if (!command || !gameId) return null
  return <ShipCommand onComplete={onComplete} onError={onError} command={command} gameId={gameId} />
}

interface ShipCommandProps extends Props {
  command: any
  gameId: string
}

const ShipCommand = ({onComplete, onError, command, gameId}: ShipCommandProps) => {
  const [showLog, setShowLog] = useState<boolean>(false)
  const flags = command && (command.getFlags() as ShipGameFlags)
  const {jobs: startedJobs, shipLog} = useStartShipOnMount(command, flags, onError)
  const [failedJobs, setFailedJobs] = useState<Job[]>([])
  const [successJobs, setSuccessJobs] = useState<Job[]>([])
  const [isComplete, setIsComplete] = useState<boolean>(false)

  const handleJobCompleted = (job: Job) => setSuccessJobs((prev) => [...prev, job])
  const handleJobFailed = (job: Job) => setFailedJobs((prev) => [...prev, job])

  const {jobsById} = useProjectJobListener({
    projectId: gameId,
    onJobCompleted: handleJobCompleted,
    onJobFailed: handleJobFailed,
  })

  useEffect(() => {
    // Detect when all jobs done and trigger onComplete or onError
    const totalCompleted = successJobs.length + failedJobs.length
    if (startedJobs && totalCompleted === startedJobs.length) {
      setIsComplete(true)
      setTimeout(() => {
        const didFail = failedJobs.length > 0
        if (didFail) {
          onError(new Error('One or more jobsById failed.'))
        } else {
          onComplete(successJobs)
        }
      }, 500)
    }
  }, [successJobs, failedJobs, startedJobs])

  // Use startedJobs just for the ids - the "live" objects come from jobsById
  const inProgressJobs = startedJobs
    ?.map((startedJob) => jobsById[startedJob.id])
    .filter((job) => job !== undefined)
    .filter((job) => job && [JobStatus.PENDING, JobStatus.PROCESSING].includes(job.status))

  if (flags?.follow) {
    if (startedJobs && startedJobs.length > 0) {
      return <JobFollow jobId={startedJobs[0].id} projectId={gameId} />
    }
    return <></>
  }

  return (
    <Box flexDirection="column">
      {startedJobs === null && <Text>{shipLog}</Text>}
      {inProgressJobs &&
        inProgressJobs.map((job) => (
          <Box flexDirection="column" key={job.id} marginBottom={1}>
            <JobStatusTable isWatching={true} jobId={job.id} projectId={job.project.id} />
            <Box flexDirection="column">
              <JobProgress job={job} />
            </Box>
            {showLog && (
              <Box marginTop={1}>
                <JobLogTail isWatching={true} jobId={job.id} length={10} projectId={job.project.id} />
              </Box>
            )}
          </Box>
        ))}
      {jobsById && !isComplete && (
        <>
          <KeyboardShortcuts gameId={gameId} jobs={inProgressJobs} onToggleJobLogs={setShowLog} />
          <Text bold>Please wait while ShipThis builds your game...</Text>
        </>
      )}
      {isComplete && <ShipResult gameId={gameId} failedJobs={failedJobs} gameFlags={flags} />}
    </Box>
  )
}
