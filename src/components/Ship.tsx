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
} from '@cli/components/index.js'
import {WEB_URL} from '@cli/constants/config.js'
import {Job, ShipGameFlags} from '@cli/types/index.js'
import {getShortUUID, useSafeInput, useShip} from '@cli/utils/index.js'

interface Props {
  onComplete: (completedJobs: Job[]) => void
  onError: (error: any) => void
}

export const Ship = ({onComplete, onError}: Props): JSX.Element => {
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

  // Start the command on mount
  const handleStartOnMount = async () => {
    if (!command) throw new Error('No command in context')
    const logFn = flags?.follow ? console.log : setShipLog
    const startedJobs = await shipMutation.mutateAsync({command, log: logFn})
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

  const handleJobComplete = (job: Job) => {
    // Add the job to the list of completed jobs
    setSuccessJobs([...successJobs, job])
    // Remove the job from the list
    const newJobs = (jobs || []).filter((prevJob) => prevJob.id !== job.id)
    setJobs(newJobs)
    // If there are no jobs left  - we are done
    if (newJobs.length === 0) {
      setIsComplete(true)
    }
  }

  const handleJobFailure = (job: Job) => {
    // Add the job to the list of failed jobs
    setFailedJobs([...failedJobs, job])
    handleJobComplete(job)
  }

  useEffect(() => {
    if (!isComplete) return
    setTimeout(() => {
      failedJobs.length === 0 ? onComplete(successJobs) : onError('One or more jobs failed')
    }, 500)
  }, [isComplete])

  if (!gameId) return <></>

  if (flags?.follow) {
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
            <>
              <Markdown
                filename="ship-failure.md.ejs"
                templateVars={{
                  jobDashboardUrl: `${WEB_URL}games/${getShortUUID(gameId)}/job/${getShortUUID(failedJobs[0].id)}`,
                }}
              />
              <Box marginTop={1}>
                {failedJobs.map((fj) => (
                  <JobLogTail isWatching={false} jobId={fj.id} key={fj.id} length={10} projectId={fj.project.id} />
                ))}
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  )
}
