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

function getSteps(platform: Platform, progress: ProjectPlatformProgress | null) {
  if (!progress) return []
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

interface FetchGameStatusProps {
  gameId: string
  platforms: Platform[]
  onComplete?: (exitCode: number) => void
}

interface FetchGameStatusResult {
  isLoading: boolean
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
    if (platform === Platform.IOS) {
      isEnabled[Platform.IOS] = !!game.details?.iosBundleId
    } else if (platform === Platform.ANDROID) {
      isEnabled[Platform.ANDROID] = !!game.details?.androidPackageName
    }
  }
  for (const platform of platforms) {
    if (isEnabled[platform as Platform])
      statuses[platform as Platform] = await getProjectPlatformProgress(game.id, platform as Platform)
  }

  let steps: string[] = []

  for (const platform of platforms) {
    if (isEnabled[platform as Platform]) {
      const platformStatus = statuses[platform as Platform]
      if (!platformStatus) continue
      steps = steps.concat(getSteps(platform as Platform, platformStatus))
    } else {
      steps.push(`shipthis game wizard ${platform.toLowerCase()}`)
    }
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
    isLoading: false,
    game,
    isEnabled,
    statuses,
    steps,
    exitCode,
  }
}

const useGameStatus = ({gameId, platforms, onComplete}: FetchGameStatusProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [game, setGame] = useState<Project | null>(null)
  const [isEnabled, setIsEnabled] = useState<Partial<Record<Platform, Boolean>>>({})
  const [statuses, setStatuses] = useState<Partial<Record<Platform, ProjectPlatformProgress>>>({})
  const [steps, setSteps] = useState<string[]>([])

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      try {
        const result = await fetchGameStatus(gameId, platforms)
        setGame(result.game)
        setIsEnabled(result.isEnabled)
        setStatuses(result.statuses)
        setSteps(result.steps)
        // To force rendering
        setTimeout(() => {
          if (onComplete) onComplete(result.exitCode)
        }, 0)
      } catch (error) {
        console.error('Error fetching game status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [])

  return {
    game,
    isLoading,
    isEnabled,
    statuses,
    steps,
  } as FetchGameStatusResult
}

interface GameStatusSafeProps {
  gameId: string
  onComplete?: (exitCode: number) => void
  children?: React.ReactNode
}

const GameStatusSafe = ({gameId, onComplete, children}: GameStatusSafeProps) => {
  const {command} = useContext(CommandContext)
  const flags = (command && (command.getFlags() as {platform?: string})) || {}

  const platforms: Platform[] = flags.platform
    ? [flags.platform.toUpperCase() as Platform]
    : [Platform.IOS, Platform.ANDROID]

  const {isLoading, game, statuses, steps} = useGameStatus({gameId, platforms, onComplete})

  if (isLoading) {
    return <Text></Text>
  }

  return (
    <Box flexDirection="column">
      <StatusTable
        title="Game Details"
        statuses={{
          'Game ID': getShortUUID(game.id),
          Name: game.name,
          Version: `${game.details?.semanticVersion || '0.0.1'}`,
          'Build Number': `${game.details?.buildNumber || 1}`,
          'Created At': getShortDate(game.createdAt),
          'Game Engine': `${game.details?.gameEngine || 'godot'} ${game.details?.gameEngineVersion || '4.3'}`,
        }}
      />
      {platforms.includes(Platform.IOS) && (
        <>
          {statuses[Platform.IOS] ? (
            <StatusTable marginTop={1} title="iOS Status" statuses={progressToStatuses(statuses[Platform.IOS])} />
          ) : (
            <Box marginTop={1}>
              <Text color={platforms.length == 1 ? 'red' : 'yellow'}>
                The iOS platform is not enabled for this game.
              </Text>
            </Box>
          )}
        </>
      )}
      {platforms.includes(Platform.ANDROID) && (
        <>
          {statuses[Platform.ANDROID] ? (
            <StatusTable
              marginTop={1}
              title="Android Status"
              statuses={progressToStatuses(statuses[Platform.ANDROID])}
            />
          ) : (
            <Box marginTop={1}>
              <Text color={platforms.length == 1 ? 'red' : 'yellow'}>
                The Android platform is not enabled for this game.
              </Text>
            </Box>
          )}
        </>
      )}

      {children}

      <NextSteps steps={steps} />
    </Box>
  )
}

interface GameStatusProps {
  onComplete?: (exitCode: number) => void
  children?: React.ReactNode
}

export const GameStatus = ({onComplete, children}: GameStatusProps) => {
  const {gameId} = useContext(GameContext)

  if (!gameId) return null
  return (
    <GameStatusSafe gameId={gameId} onComplete={onComplete}>
      {children}
    </GameStatusSafe>
  )
}
