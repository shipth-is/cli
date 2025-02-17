import {render} from 'ink'
import {Flags} from '@oclif/core'

import {Command, NextSteps, StatusTable} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProjectPlatformProgress} from '@cli/api/index.js'
import {Platform, ProjectPlatformProgress} from '@cli/types'
import {getShortDate, getShortUUID, makeHumanReadable} from '@cli/utils/index.js'

function getSteps(platform: Platform, progress: ProjectPlatformProgress | null) {
  if (!progress) return []
  switch (platform) {
    case Platform.ANDROID:
      return [
        !progress.hasCredentialsForPlatform && '$ shipthis game android keyStore create',
        !progress.hasApiKeyForPlatform && '$ shipthis game android apiKey create',
        progress.hasCredentialsForPlatform && progress.hasApiKeyForPlatform && '$ shipthis game ship',
      ].filter(Boolean) as string[]

    case Platform.IOS:
      return [
        !progress.hasApiKeyForPlatform && '$ shipthis apple apiKey create',
        !progress.hasCredentialsForPlatform && '$ shipthis game ios profile create',
        progress.hasApiKeyForPlatform && progress.hasCredentialsForPlatform && '$ shipthis game ship',
      ].filter(Boolean) as string[]

    default:
      throw new Error('Invalid platform')
  }
}

export default class GameStatus extends BaseGameCommand<typeof GameStatus> {
  static override args = {}

  static override description = 'Shows the status of the current game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()

    const hasConfiguredIos = !!game.details?.iosBundleId
    const hasConfiguredAndroid = !!game.details?.androidPackageName

    let statuses = {
      [Platform.IOS]: hasConfiguredIos ? await getProjectPlatformProgress(game.id, Platform.IOS) : null,
      [Platform.ANDROID]: hasConfiguredAndroid ? await getProjectPlatformProgress(game.id, Platform.ANDROID) : null,
    }

    let steps: string[] = []
    if (hasConfiguredIos) steps = steps.concat(getSteps(Platform.IOS, statuses[Platform.IOS]))
    if (hasConfiguredAndroid) steps = steps.concat(getSteps(Platform.ANDROID, statuses[Platform.ANDROID]))

    const progressToStatuses = (progress: ProjectPlatformProgress) => {
      // Remove the 'platform' key as we have titles
      const {platform, ...rest} = progress
      return makeHumanReadable(rest)
    }

    render(
      <Command command={this}>
        <StatusTable
          marginBottom={1}
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
        {statuses[Platform.IOS] && (
          <StatusTable title="iOS Status" statuses={progressToStatuses(statuses[Platform.IOS])} />
        )}
        {statuses[Platform.ANDROID] && (
          <StatusTable title="Android Status" statuses={progressToStatuses(statuses[Platform.ANDROID])} />
        )}
        <NextSteps steps={steps} />
      </Command>,
    )
  }
}
