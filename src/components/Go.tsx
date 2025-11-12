import {useContext, useState} from 'react'

import {getShortUUID, useProjectJobListener, useStartShipOnMount} from '@cli/utils/index.js'
import {getJobBuildsRetry} from '@cli/api/index.js'

import {CommandContext, GameContext, JobProgress, QRCodeTerminal} from './index.js'
import {Job, Platform} from '@cli/types/api.js'
import {useGoRuntimeLogListener} from '@cli/utils/hooks/useGoRuntimeLogListener.js'

interface Props {
  onComplete: () => void
  onError: (error: any) => void
}

export const Go = ({onComplete, onError}: Props): JSX.Element | null => {
  const {command} = useContext(CommandContext)
  const {gameId} = useContext(GameContext)
  if (!command || !gameId) return null
  return <GoCommand command={command} gameId={gameId} onComplete={onComplete} onError={onError} />
}

interface GoCommandProps extends Props {
  command: any
  gameId: string
}

const LogListener = ({projectId, buildId}: {projectId: string; buildId: string}) => {
  useGoRuntimeLogListener({projectId, buildId})
  return null
}

const GoCommand = ({command, gameId, onComplete, onError}: GoCommandProps): JSX.Element | null => {
  const flags = {follow: false, platform: 'go'}

  const [buildId, setBuildId] = useState<string | null>(null)
  const [qrCodeData, setQRCodeData] = useState<string | null>(null)

  const {jobs: startedJobs} = useStartShipOnMount(command, flags, onError)

  const handleJobCompleted = async (job: Job) => {
    if (job.type != Platform.GO) return
    const [goBuild] = await getJobBuildsRetry(job.id, command.getGameId())
    setBuildId(goBuild.id)
    setQRCodeData(getShortUUID(goBuild.id))
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    await sleep(500)
    //onComplete()
  }

  const handleJobFailed = (job: any) => {
    if (job.type != Platform.GO) return
    onError(new Error(`Go job failed: ${job.id}`))
  }

  const {jobsById} = useProjectJobListener({
    projectId: gameId,
    onJobCompleted: handleJobCompleted,
    onJobFailed: handleJobFailed,
  })

  if (qrCodeData && buildId) {
    return (
      <>
        <QRCodeTerminal data={qrCodeData} />
        <LogListener projectId={gameId} buildId={buildId} />
      </>
    )
  }

  if (startedJobs && startedJobs?.length > 0) {
    return <JobProgress job={startedJobs[0]} />
  }

  return null
}
