import {Box, Text} from 'ink'
import open from 'open'
import {useContext, useEffect, useState} from 'react'

import {getShortAuthRequiredUrl} from '@cli/api/index.js'
import {
  CommandContext,
  GameContext,
  JobFollow,
  JobLogTail,
  JobProgress,
  JobStatusTable,
  Markdown,
  ShipFailure,
} from '@cli/components/index.js'
import {WEB_URL} from '@cli/constants/config.js'
import {Job, ShipGameFlags} from '@cli/types/index.js'
import {getShortUUID, useSafeInput, useShip} from '@cli/utils/index.js'

// Time for ink to paint the last frame before the command exits
const EXIT_FLUSH_MS = 500

interface Props {
  onComplete: (completedJobs: Job[]) => void
  onError: (error: any) => void
  onFailure: (failedJobs: Job[]) => void
}

export const Ship = ({onComplete, onError, onFailure}: Props): JSX.Element => {
  const {command} = useContext(CommandContext)
  const flags = command && (command.getFlags() as ShipGameFlags)
  const {gameId} = useContext(GameContext)
  const shipMutation = useShip()

  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [failedJobs, setFailedJobs] = useState<Job[]>([])
  const [successJobs, setSuccessJobs] = useState<Job[]>([])

  const [shipLog, setShipLog] = useState<string>('') // message shown as we prepare the shipping
  const [showLog, setShowLog] = useState<boolean>(false)

  const [isComplete, setIsComplete] = useState<boolean>(false)

  const [areFailureLogsLoaded, setAreFailureLogsLoaded] = useState<boolean>(false) // the failure summary is filled in

  // Start the command on mount
  const handleStartOnMount = async () => {
    if (!command) throw new Error('No command in context')
    const logFn = flags?.follow || flags?.dryRun ? console.log : setShipLog
    const startedJobs = await shipMutation.mutateAsync({command, log: logFn, warnLog: console.warn})
    setJobs(startedJobs)
  }

  useEffect(() => {
    handleStartOnMount().catch(onError)
  }, [])

  useSafeInput(async (input) => {
    if (!gameId) return
    const i = input.toLowerCase()
    switch (i) {
      case 'l': {
        setShowLog((prev) => !prev)
        break
      }

      case 'b': {
        const dashUrl = jobs?.length === 1 ? `/games/${gameId}/job/${jobs[0].id}` : `/games/${gameId}`
        const url = await getShortAuthRequiredUrl(dashUrl)
        await open(url)
        break
      }
    }
  })

  // Two platforms that fail together arrive as two websocket messages, and React
  // batches them. Reading the arrays from the render closure lost one of the two
  // removals, so the run waited forever for a job that had already finished.
  const removeJob = (job: Job) => setJobs((prev) => (prev || []).filter((prevJob) => prevJob.id !== job.id))

  const handleJobComplete = (job: Job) => {
    setSuccessJobs((prev) => [...prev, job])
    removeJob(job)
  }

  const handleJobFailure = (job: Job) => {
    setFailedJobs((prev) => [...prev, job])
    removeJob(job)
  }

  // Derived, because a removal can no longer see the array it produced. `jobs` is
  // null until the jobs start, and a dry run exits before it is set.
  useEffect(() => {
    if (jobs !== null && jobs.length === 0) setIsComplete(true)
  }, [jobs])

  useEffect(() => {
    if (!isComplete || failedJobs.length > 0) return
    const timer = setTimeout(() => onComplete(successJobs), EXIT_FLUSH_MS)
    return () => clearTimeout(timer)
  }, [isComplete])

  // Exiting on a fixed timer cut the log tails off mid-fetch and left a spinner
  // on screen, so the failure exit waits for the summary to fill in.
  useEffect(() => {
    if (!isComplete || failedJobs.length === 0 || !areFailureLogsLoaded) return
    const timer = setTimeout(() => onFailure(failedJobs), EXIT_FLUSH_MS)
    return () => clearTimeout(timer)
  }, [isComplete, areFailureLogsLoaded])

  if (!gameId) return <></>

  if (flags?.follow || flags?.dryRun) {
    if (isComplete && failedJobs.length > 0) {
      return (
        <ShipFailure
          failedJobs={failedJobs}
          gameId={gameId}
          onLogsLoaded={() => setAreFailureLogsLoaded(true)}
          showLogTail={false}
        />
      )
    }

    if (jobs && jobs.length > 0) {
      return (
        <JobFollow jobId={jobs[0].id} onComplete={handleJobComplete} onFailure={handleJobFailure} projectId={gameId} />
      )
    }

    return <></>
  }

  return (
    <Box flexDirection="column">
      {jobs === null && <Text>{shipLog}</Text>}
      {jobs &&
        jobs.map((job) => (
          <Box flexDirection="column" key={job.id} marginBottom={1}>
            <JobStatusTable isWatching={true} jobId={job.id} projectId={job.project.id} />
            <Box flexDirection="column">
              <JobProgress job={job} onComplete={handleJobComplete} onFailure={handleJobFailure} />
            </Box>
            {showLog && (
              <Box marginTop={1}>
                <JobLogTail isWatching={true} jobId={job.id} length={10} projectId={job.project.id} />
              </Box>
            )}
          </Box>
        ))}
      {jobs && !isComplete && (
        <>
          <Text>Press L to show and hide the job logs.</Text>
          <Text>Press B to open the ShipThis dashboard in your browser.</Text>
          <Text bold>Please wait while ShipThis builds your game...</Text>
        </>
      )}
      {isComplete && (
        <>
          {failedJobs.length === 0 && (
            <Markdown
              filename="ship-success.md.ejs"
              templateVars={{
                gameBuildsUrl: `${WEB_URL}games/${getShortUUID(gameId)}/builds`,
                wasPublished: !(flags?.skipPublish || flags?.useDemoCredentials),
                usedDemoCredentials: !!flags?.useDemoCredentials,
              }}
            />
          )}
          {failedJobs.length > 0 && (
            <ShipFailure
              failedJobs={failedJobs}
              gameId={gameId}
              onLogsLoaded={() => setAreFailureLogsLoaded(true)}
              showLogTail={true}
            />
          )}
        </>
      )}
    </Box>
  )
}
