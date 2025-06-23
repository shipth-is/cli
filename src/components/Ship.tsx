import {useContext, useEffect, useState} from 'react'

import {Text, Box, useInput} from 'ink'
import open from 'open'

import {
  CommandContext,
  GameContext,
  JobLogTail,
  JobProgress,
  JobStatusTable,
  Markdown,
  JobFollow,
} from '@cli/components/index.js'
import {getShortUUID, useShip} from '@cli/utils/index.js'
import {Job, ShipGameFlags} from '@cli/types/index.js'
import {getShortAuthRequiredUrl} from '@cli/api/index.js'
import {WEB_URL} from '@cli/constants/config.js'

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
    const startedJobs = await shipMutation.mutateAsync({command, log: setShipLog})
    setJobs(startedJobs)
  }

  useEffect(() => {
    handleStartOnMount().catch(onError)
  }, [])

  useInput(async (input) => {
    if (!gameId) return
    switch (input) {
      case 'l':
        setShowLog((prev) => !prev)
        break
      case 'b':
        const dashUrl = jobs?.length !== 1 ? `/games/${gameId}` : `/games/${gameId}/job/${jobs[0].id}`
        const url = await getShortAuthRequiredUrl(dashUrl)
        await open(url)
        break
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
        <JobFollow projectId={gameId} jobId={jobs[0].id} onComplete={handleJobComplete} onFailure={handleJobFailure} />
      )
    }

    return <></>
  }

  return (
    <Box flexDirection="column">
      {jobs == null && <Text>{shipLog}</Text>}
      {jobs &&
        jobs.map((job) => (
          <Box key={job.id} flexDirection="column" marginBottom={1}>
            <JobStatusTable jobId={job.id} projectId={job.project.id} isWatching={true} />
            <Box flexDirection="column">
              <JobProgress job={job} onComplete={handleJobComplete} onFailure={handleJobFailure} />
            </Box>
            {showLog && (
              <Box marginTop={1}>
                <JobLogTail jobId={job.id} projectId={job.project.id} isWatching={true} length={10} />
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
          {failedJobs.length == 0 && (
            <Markdown
              filename="ship-success.md"
              templateVars={{
                gameBuildsUrl: `${WEB_URL}games/${getShortUUID(gameId)}/builds`,
              }}
            />
          )}
          {failedJobs.length > 0 && (
            <>
              <Markdown
                filename="ship-failure.md"
                templateVars={{
                  jobDashboardUrl: `${WEB_URL}games/${getShortUUID(gameId)}/job/${getShortUUID(failedJobs[0].id)}`,
                }}
              />
              <Box marginTop={1}>
                {failedJobs.map((fj) => (
                  <JobLogTail key={fj.id} jobId={fj.id} projectId={fj.project.id} isWatching={false} length={10} />
                ))}
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  )
}
