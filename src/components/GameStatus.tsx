import {Box, Text} from 'ink'
import {useContext, useEffect, useState} from 'react'

import {getProject, getProjectPlatformProgress} from '@cli/api/index.js'
import {CommandContext, GameContext, NextSteps, StatusTable} from '@cli/components/index.js'
import {Platform, Project, ProjectPlatformProgress} from '@cli/types/api.js'
import {getShortDate, getShortUUID, makeHumanReadable} from '@cli/utils/index.js'

function isPlatformConfigured(platform: Platform, progress: ProjectPlatformProgress | null): boolean {
  if (!progress) return false
  return (
    progress.platform === platform &&
    progress.hasBundleSet &&
    progress.hasCredentialsForPlatform &&
    progress.hasApiKeyForPlatform
  )
}

function getSteps(platform: Platform, progress: ProjectPlatformProgress | null | undefined): string[] {
  if (!progress) return ['shipthis game wizard ' + platform.toLowerCase()]
  switch (platform) {
    case Platform.ANDROID: {
      return [
        !progress.hasCredentialsForPlatform && 'shipthis game android keyStore create',
        !progress.hasApiKeyForPlatform && 'shipthis game android apiKey create',
        isPlatformConfigured(platform, progress) && 'shipthis game ship',
      ].filter(Boolean) as string[]
    }

    case Platform.IOS: {
      // TODO: what about creating the app? shipthis game ios app create
      // we may need more backend flags to determine if the app exists etc
      return [
        !progress.hasApiKeyForPlatform && 'shipthis apple apiKey create',
        !progress.hasCredentialsForPlatform && 'shipthis game ios profile create',
        isPlatformConfigured(platform, progress) && 'shipthis game ship',
      ].filter(Boolean) as string[]
    }

    default: {
      throw new Error('Invalid platform')
    }
  }
}

interface FetchGameStatusResult {
  exitCode: number
  game: Project
  isEnabled: Partial<Record<Platform, boolean>>
  statuses: Partial<Record<Platform, ProjectPlatformProgress>>
  steps: string[]
}

async function fetchGameStatus(gameId: string, platforms: Platform[]): Promise<FetchGameStatusResult> {
  const game = await getProject(gameId)

  const isEnabled: Partial<Record<Platform, boolean>> = {}
  const statuses: Partial<Record<Platform, ProjectPlatformProgress>> = {}

  for (const platform of platforms) {
    // The platform is considered enabled if it has the identifier set
    isEnabled[platform] = platform === Platform.IOS ? Boolean(game.details?.iosBundleId) : Boolean(game.details?.androidPackageName)
    if (isEnabled[platform]) {
      // Call the backend to tell us the status of the platform for this game
      statuses[platform] = await getProjectPlatformProgress(game.id, platform)
    }
  }

  // Collate the steps that the user should take based on the platform statuses
  let steps: string[] = []
  for (const platform of platforms) {
    steps = steps.concat(getSteps(platform, statuses[platform]))
  }

  // Determine the exit code - this is for use in other pipeline tools - e.g. github action
  let exitCode = 0
  for (const platform of platforms) {
    const platformStatus = statuses[platform as Platform]
    if (!platformStatus) continue
    // Enabled but not configured - then error
    const hasConfigError = isEnabled[platform] && !isPlatformConfigured(platform as Platform, platformStatus)
    if (hasConfigError) exitCode = exitCode || 1
  }

  // If specifically checking a platform e.g android and android is not enabled, exit with code 1
  // If checking both and both are not enabled, exit with code 1
  if (platforms.length === 1 && !isEnabled[platforms[0]]) {
    exitCode = exitCode || 1
  } else if (platforms.length > 1 && !isEnabled[Platform.IOS] && !isEnabled[Platform.ANDROID]) {
    exitCode = exitCode || 1
  }

  return {
    exitCode,
    game,
    isEnabled,
    statuses,
    steps,
  }
}

interface GameStatusDetailsProps extends GameStatusProps {
  gameId: string
  platforms: Platform[]
}

export const GameStatusDetails = ({children, gameId, onComplete, onError, platforms}: GameStatusDetailsProps) => {
  const [state, setState] = useState<FetchGameStatusResult | null>(null)

  useEffect(() => {
    fetchGameStatus(gameId, platforms)
      .then((res) => {
        setState(res)
        // TODO: do we need the setTimeout here?
        setTimeout(() => onComplete?.(res.exitCode), 0)
      })
      .catch((error) => onError?.(error))
  }, [])

  if (!state) return <Text></Text>

  const {game, statuses, steps} = state

  return (
    <Box flexDirection="column">
      <StatusTable
        statuses={{
          'Build Number': `${game.details?.buildNumber || 1}`,
          'Created At': getShortDate(game.createdAt),
          'Game Engine': `${game.details?.gameEngine || 'godot'} ${game.details?.gameEngineVersion || '4.3'}`,
          'Game ID': getShortUUID(game.id),
          Name: game.name,
          Version: game.details?.semanticVersion || '0.0.1',
        }}
        title="Game Details"
      />

      {platforms.map((platform) => {
        const status = statuses[platform]
        const label = platform === Platform.IOS ? 'iOS' : 'Android'
        const color = platforms.length === 1 ? 'red' : 'yellow'
        const {platform: _, ...statusValues} = status || {}
        return (
          <Box key={platform} marginTop={1}>
            {status ? (
              <StatusTable statuses={makeHumanReadable(statusValues)} title={`${label} Status`} />
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
  children?: React.ReactNode
  onComplete?: (exitCode: number) => void
  onError?: (error: Error) => void
}

export const GameStatus = ({children, onComplete}: GameStatusProps) => {
  const {gameId} = useContext(GameContext)
  const {command} = useContext(CommandContext)
  const flags = (command && (command.getFlags() as {platform?: string})) || {}

  const platforms: Platform[] = flags.platform
    ? [flags.platform.toUpperCase() as Platform]
    : [Platform.IOS, Platform.ANDROID]

  if (!gameId) return null
  return (
    <GameStatusDetails gameId={gameId} onComplete={onComplete} platforms={platforms}>
      {children}
    </GameStatusDetails>
  )
}
