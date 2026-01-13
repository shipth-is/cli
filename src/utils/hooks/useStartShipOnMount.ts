import {useEffect, useState} from 'react'
import {Job} from '@cli/types/index.js'
import {useShip} from '@cli/utils/index.js'

export const useStartShipOnMount =  (command: any, flags: any, onError: (e: any) => void) => {
  const shipMutation = useShip()

  const [shipLog, setShipLog] = useState('')
  const [jobs, setJobs] = useState<null|Job[]>(null)

  // Start the command on mount
  const handleStartOnMount = async () => {
    if (!command) throw new Error('No command in context')
    const logFn = flags?.follow ? console.log : setShipLog
    const startedJobs = await shipMutation.mutateAsync({command, log: logFn, shipFlags: flags})
    setJobs(startedJobs)
  }

  useEffect(() => {
    handleStartOnMount().catch(onError)
  }, [])

  return {
    jobs,
    shipLog,
  }
}