import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import {useContext, useEffect, useRef, useState} from 'react'

import {isInitialAndroidBuild, isRunningInitialAndroidJob} from '@cli/components/android/AndroidWizard/utils.js'
import {CommandContext, JobLogTail, JobProgress, StepProps} from '@cli/components/index.js'
import {Job} from '@cli/types/api.js'
import {JobFailedError, useBuilds, useJobs, useShip} from '@cli/utils/index.js'

export interface InitialAndroidBuildProps extends StepProps {
  gameId: string
}

export const InitialAndroidBuild = ({gameId, onComplete, onError, ...boxProps}: InitialAndroidBuildProps) => {
  const {command} = useContext(CommandContext)
  const {data: buildData, isLoading: isLoadingBuilds} = useBuilds({pageNumber: 0, projectId: gameId})
  const {data: jobData, isLoading: isLoadingJobs} = useJobs({
    pageNumber: 0,
    projectId: gameId,
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

    const hasAndroidBuild = buildData.data.some(isInitialAndroidBuild)
    // If we now have a build - trigger the onComplete
    if (!prevHasBuild.current && hasAndroidBuild) return onComplete()
    prevHasBuild.current = hasAndroidBuild
    const hasRunningAndroidJob = jobData.data.some(isRunningInitialAndroidJob)
    // If we don't have a build and we don't have an android job - run the ship command
    const shouldRun = !hasAndroidBuild && !hasRunningAndroidJob
    if (shouldRun)
      shipMutation
        .mutateAsync({
          command,
          log: setShipLog,
          warnLog: setShipLog, // TODO orange color
          shipFlags: {
            platform: 'android',
            skipPublish: true,
            // Not the game setting - Google Play needs the user's package name and keystore
            useDemoCredentials: false,
          },
        })
        .catch(onError)
  }, [buildData, jobData, command])

  const androidJob = jobData?.data.find(isRunningInitialAndroidJob)

  return (
    <>
      <Box flexDirection="column" gap={1} {...boxProps}>
        <Box flexDirection="row" gap={1}>
          <Text>Create an initial build...</Text>
          {(isLoadingBuilds || isLoadingJobs || shipMutation.isPending) && <Spinner type="dots" />}
        </Box>
        {androidJob == null && shipLog && <Text>{shipLog}</Text>}
        {androidJob && (
          <>
            <JobProgress
              job={androidJob}
              onComplete={onComplete}
              onFailure={(j: Job) => onError(new JobFailedError(j))}
            />
            <JobLogTail isWatching={true} jobId={androidJob.id} length={10} projectId={gameId} />
          </>
        )}
      </Box>
    </>
  )
}
