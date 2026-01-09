import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import {useContext, useEffect, useRef, useState} from 'react'

import {CommandContext, JobLogTail, JobProgress, Markdown, StepProps} from '@cli/components/index.js'
import {WEB_URL} from '@cli/constants/config.js'
import {BuildType, Job, JobStatus, Platform} from '@cli/types/api.js'
import {getShortUUID, useBuilds, useJobs, useShip} from '@cli/utils/index.js'

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
  const [failedJob, setFailedJob] = useState<Job | null>(null)

  // Trigger a build if we don't have one
  useEffect(() => {
    if (isLoadingBuilds || isLoadingJobs) return
    if (!buildData) return
    if (!jobData) return
    if (!command) return

    const hasAndroidBuild = buildData.data.some(
      (build) => build.platform === Platform.ANDROID && build.buildType == BuildType.AAB,
    )
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
          shipFlags: {
            platform: 'android',
            skipPublish: true,
          },
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
        {androidJob === null && <Text>{shipLog}</Text>}
        {androidJob && (
          <JobProgress
            job={androidJob}
            onComplete={onComplete}
            onFailure={(j: Job) => {
              setFailedJob(j)
              // Wait before triggering the error to allow the job log to be displayed
              setTimeout(() => {
                onError(new Error(`Job ${j.id} failed`))
              }, 1000)
            }}
          />
        )}

        {failedJob && (
          <>
            <Markdown
              filename="ship-failure.md.ejs"
              templateVars={{
                jobDashboardUrl: `${WEB_URL}games/${getShortUUID(gameId)}/job/${getShortUUID(failedJob.id)}`,
              }}
            />
            <Box marginTop={1}>
              <JobLogTail isWatching={false} jobId={failedJob.id} length={10} projectId={gameId} />
            </Box>
          </>
        )}
      </Box>
    </>
  )
}
