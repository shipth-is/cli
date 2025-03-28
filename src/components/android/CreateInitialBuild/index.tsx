import {Box, Text} from 'ink'
import {useContext, useEffect, useRef, useState} from 'react'
import Spinner from 'ink-spinner'

import {CommandContext, GameContext, StepProps, JobProgress} from '@cli/components/index.js'
import {useBuilds, useJobs, useShip} from '@cli/utils/index.js'
import {JobStatus, Platform} from '@cli/types/api.js'

export const CreateInitialBuild = (props: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)
  return <>{gameId && <CreateForGame gameId={gameId} {...props} />}</>
}

interface CreateForGameProps extends StepProps {
  gameId: string
}

const CreateForGame = ({onComplete, onError, gameId, ...boxProps}: CreateForGameProps) => {
  const {command} = useContext(CommandContext)
  const {data: buildData, isLoading: isLoadingBuilds} = useBuilds({projectId: gameId, pageNumber: 0})
  const {data: jobData, isLoading: isLoadingJobs} = useJobs({
    projectId: gameId,
    pageNumber: 0,
  })
  const prevHasBuild = useRef<boolean>(false)
  const shipMutation = useShip()
  const [shipLog, setShipLog] = useState<string>('')

  // Trigger a build if we don't have one
  useEffect(() => {
    if (isLoadingBuilds || isLoadingJobs) return
    if (!buildData) return
    if (!jobData) return
    if (!command) return

    const hasAndroidBuild = buildData.data.some((build) => build.platform === Platform.ANDROID)
    // If we now have a build - trigger the onComplete
    if (!prevHasBuild.current && hasAndroidBuild) return onComplete()
    prevHasBuild.current = hasAndroidBuild
    const hasRunningAndroidJob = jobData.data.some(
      (job) => job.type === Platform.ANDROID && [JobStatus.PENDING, JobStatus.PROCESSING].includes(job.status),
    )
    // If we don't have a build and we don't have an android job - run the ship command
    const shouldRun = !hasAndroidBuild && !hasRunningAndroidJob
    if (shouldRun)
      shipMutation
        .mutateAsync({
          command,
          log: setShipLog,
        })
        .catch(onError)
  }, [buildData, jobData, command])

  const androidJob = jobData?.data.find(
    (job) => job.type === Platform.ANDROID && [JobStatus.PENDING, JobStatus.PROCESSING].includes(job.status),
  )

  return (
    <>
      <Box flexDirection="column" gap={1} {...boxProps}>
        <Box flexDirection="row" gap={1}>
          <Text>Create an initial build...</Text>
          {(isLoadingBuilds || isLoadingJobs || shipMutation.isPending) && <Spinner type="dots" />}
        </Box>
        {androidJob == null && <Text>{shipLog}</Text>}
        {androidJob && <JobProgress job={androidJob} onComplete={onComplete} />}
      </Box>
    </>
  )
}
