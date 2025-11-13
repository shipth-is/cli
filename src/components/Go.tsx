import {useContext, useState} from 'react'
import {Box, Text} from 'ink'

import {TruncatedText} from './common/TruncatedText.js'
import {
  getRuntimeLogLevelColor,
  getShortTime,
  getShortUUID,
  useGoRuntimeLogListener,
  useProjectJobListener,
  useStartShipOnMount,
} from '@cli/utils/index.js'
import {getJobBuildsRetry} from '@cli/api/index.js'

import {CommandContext, GameContext, JobProgress, QRCodeTerminal, Title} from './index.js'
import {Job, Platform} from '@cli/types/api.js'

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
  const {tail, messages} = useGoRuntimeLogListener({projectId, buildId})

  return (
    <>
      <Box flexDirection="column">
        {messages.map((log, i) => {
          const messageColor = getRuntimeLogLevelColor(log.level)
          return (
            <Box flexDirection="row" height={1} key={i} overflow="hidden">
              <Box>
                <Text>{getShortTime(log.sentAt)}</Text>
              </Box>
              <Box height={1} marginLeft={1} marginRight={2} overflow="hidden">
                <TruncatedText color={messageColor}>{log.message}</TruncatedText>
              </Box>
            </Box>
          )
        })}
      </Box>
    </>
  )
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
      <Box flexDirection='column'>
        <Title>Go Build QR Code</Title>
        <QRCodeTerminal data={qrCodeData} />
        <Text>{`Go build ID: ${getShortUUID(buildId)}`}</Text>
        <LogListener projectId={gameId} buildId={buildId} />
      </Box>
    )
  }

  if (startedJobs && startedJobs?.length > 0) {
    return (
      <Box flexDirection='column'>
        <Text>Generating Go build, please wait...</Text>
        <JobProgress job={startedJobs[0]} />
      </Box>
    )
  }

  return null
}
