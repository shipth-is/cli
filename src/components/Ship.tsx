import {useContext, useEffect, useState} from 'react'

import {Text, Box} from 'ink'

import {CommandContext, JobProgress, JobStatusTable} from '@cli/components/index.js'
import {useShip} from '@cli/utils/index.js'
import {Job} from '@cli/types/index.js'

interface Props {
  onComplete: () => void
  onError: (error: any) => void
}

export const Ship = ({onComplete, onError}: Props): JSX.Element => {
  const {command} = useContext(CommandContext)
  const shipMutation = useShip()
  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [shipLog, setShipLog] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  // Start the command on mount
  const handleStartOnMount = async () => {
    if (!command) throw new Error('No command in context')
    const startedJobs = await shipMutation.mutateAsync({command, log: setShipLog})
    setJobs(startedJobs)
  }

  useEffect(() => {
    handleStartOnMount().catch(onError)
  }, [])

  const handleJobComplete = (job: any) => {
    // Remove the job from the list
    const newJobs = (jobs || []).filter((prevJob) => prevJob.id !== job.id)
    setJobs(newJobs)
    // If there are no jobs left  - we are done
    if (newJobs.length === 0) {
      setShowSuccess(true)
      setTimeout(onComplete, 500)
    }
  }

  return (
    <Box flexDirection="column">
      {jobs == null && <Text>{shipLog}</Text>}
      {jobs &&
        jobs.map((job) => (
          <Box key={job.id} flexDirection="column" marginBottom={1}>
            <JobStatusTable jobId={job.id} projectId={job.project.id} isWatching={true} />
            <Box width={100} flexDirection="column">
              <JobProgress job={job} onComplete={() => handleJobComplete(job)} />
            </Box>
          </Box>
        ))}
      {jobs && !showSuccess && <Text bold>Please wait while ShipThis builds your game...</Text>}
      {showSuccess && <Text color="green">🚀 Shipped</Text>}
    </Box>
  )
}
