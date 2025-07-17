import {Box, Text} from 'ink'
import {useContext, useEffect, useState} from 'react'

import {getProject, getProjectPlatformProgress} from '@cli/api/index.js'
import {Platform, Project, ProjectPlatformProgress} from '@cli/types/api.js'
import {getShortDate, getShortUUID, makeHumanReadable} from '@cli/utils/index.js'
import {StatusTable, NextSteps, CommandContext, GameContext} from '@cli/components/index.js'

function isPlatformConfigured(platform: Platform, progress: ProjectPlatformProgress | null): boolean {
  if (!progress) return false
  return progress.platform === platform && progress.hasCredentialsForPlatform && progress.hasApiKeyForPlatform
}

function getSteps(platform: Platform, progress: ProjectPlatformProgress | null | undefined): string[] {
  if (!progress) return ['shipthis game wizard ' + platform.toLowerCase()]
  switch (platform) {
    case Platform.ANDROID:
      return [
        !progress.hasCredentialsForPlatform && 'shipthis game android keyStore create',
        !progress.hasApiKeyForPlatform && 'shipthis game android apiKey create',
        isPlatformConfigured(platform, progress) && 'shipthis game ship',
      ].filter(Boolean) as string[]

    case Platform.IOS:
      return [
        !progress.hasApiKeyForPlatform && 'shipthis apple apiKey create',
        !progress.hasCredentialsForPlatform && 'shipthis game ios profile create',
        isPlatformConfigured(platform, progress) && 'shipthis game ship',
      ].filter(Boolean) as string[]

    default:
      throw new Error('Invalid platform')
  }
}

function progressToStatuses(progress: ProjectPlatformProgress) {
  // Remove the 'platform' key as we have titles
  const {platform, ...rest} = progress
  return makeHumanReadable(rest)
}

interface FetchGameStatusResult {
  game: Project
  isEnabled: Partial<Record<Platform, Boolean>>
  statuses: Partial<Record<Platform, ProjectPlatformProgress>>
  steps: string[]
  exitCode: number
}

async function fetchGameStatus(gameId: string, platforms: Platform[]): Promise<FetchGameStatusResult> {
  const game = await getProject(gameId)

  const isEnabled: Partial<Record<Platform, Boolean>> = {}
  const statuses: Partial<Record<Platform, ProjectPlatformProgress>> = {}

  for (const platform of platforms) {
    const hasEnabled = platform === Platform.IOS ? !!game.details?.iosBundleId : !!game.details?.androidPackageName
    isEnabled[platform] = hasEnabled
    if (hasEnabled) {
      statuses[platform] = await getProjectPlatformProgress(game.id, platform)
    }
  }

  let steps: string[] = []

  for (const platform of platforms) {
    steps = steps.concat(getSteps(platform, statuses[platform]))
  }

  let exitCode = 0

  for (const platform of platforms) {
    const platformStatus = statuses[platform as Platform]
    if (!platformStatus) continue
    const hasConfigError = isEnabled && !isPlatformConfigured(platform as Platform, platformStatus)
    if (hasConfigError) exitCode = exitCode || 1
  }

  // if specifically checking android and android is not enabled, exit with code 1
  // if checking both and both are not enabled, exit with code 1

  if (platforms.length === 1 && !isEnabled[platforms[0]]) {
    exitCode = exitCode || 1
  } else if (platforms.length > 1 && !isEnabled[Platform.IOS] && !isEnabled[Platform.ANDROID]) {
    exitCode = exitCode || 1
  }

  return {
    game,
    isEnabled,
    statuses,
    steps,
    exitCode,
  }
}

interface GameStatusDetailsProps extends GameStatusProps {
  gameId: string
  platforms: Platform[]
}

export const GameStatusDetails = ({gameId, platforms, onComplete, onError, children}: GameStatusDetailsProps) => {
  const [state, setState] = useState<FetchGameStatusResult | null>(null)

  useEffect(() => {
    fetchGameStatus(gameId, platforms)
      .then((res) => {
        setState(res)
        setTimeout(() => onComplete?.(res.exitCode), 0)
      })
      .catch((e) => {
        onError?.(e)
      })
  }, [])

  if (!state) return <Text></Text>

  const {game, statuses, steps} = state

  return (
    <Box flexDirection="column">
      <StatusTable
        title="Game Details"
        statuses={{
          'Game ID': getShortUUID(game.id),
          Name: game.name,
          Version: game.details?.semanticVersion || '0.0.1',
          'Build Number': `${game.details?.buildNumber || 1}`,
          'Created At': getShortDate(game.createdAt),
          'Game Engine': `${game.details?.gameEngine || 'godot'} ${game.details?.gameEngineVersion || '4.3'}`,
        }}
      />

      {platforms.map((platform) => {
        const status = statuses[platform]
        const label = platform === Platform.IOS ? 'iOS' : 'Android'
        const color = platforms.length === 1 ? 'red' : 'yellow'
        return (
          <Box key={platform} marginTop={1}>
            {status ? (
              <StatusTable title={`${label} Status`} statuses={progressToStatuses(status)} />
            ) : (
              <Text color={color}>The {label} platform is not enabled for this game.</Text>
            )}
          </Box>
        )
      })}

      {children}
      <NextSteps steps={steps} />
    </Box>
  )
}

interface GameStatusProps {
  onComplete?: (exitCode: number) => void
  onError?: (error: Error) => void
  children?: React.ReactNode
}

export const GameStatus = ({onComplete, children}: GameStatusProps) => {
  const {gameId} = useContext(GameContext)
  const {command} = useContext(CommandContext)
  const flags = (command && (command.getFlags() as {platform?: string})) || {}

  const platforms: Platform[] = flags.platform
    ? [flags.platform.toUpperCase() as Platform]
    : [Platform.IOS, Platform.ANDROID]

  if (!gameId) return null
  return (
    <GameStatusDetails gameId={gameId} platforms={platforms} onComplete={onComplete}>
      {children}
    </GameStatusDetails>
  )
}
