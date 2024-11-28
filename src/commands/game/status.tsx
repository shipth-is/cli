import {render} from 'ink'
import {Flags} from '@oclif/core'

import {App, NextSteps, StatusTable} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProjectPlatformProgress} from '@cli/api/index.js'
import {Platform, ProjectPlatformProgress} from '@cli/types'
import {getShortDate, getShortUUID, makeHumanReadable} from '@cli/utils/index.js'

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
    const iosPlatformStatus = await getProjectPlatformProgress(game.id, Platform.IOS)

    const {hasBundleSet, hasApiKeyForPlatform, hasCredentialsForPlatform} = iosPlatformStatus

    const steps = [
      hasBundleSet == false && '$ shipthis game ios app create',
      hasApiKeyForPlatform == false && '$ shipthis apple apiKey create',
      hasCredentialsForPlatform == false && '$ shipthis game ios profile create',
      hasBundleSet && hasApiKeyForPlatform && hasCredentialsForPlatform && '$ shipthis game ship',
    ].filter(Boolean) as string[]

    const progressToStatuses = (progress: ProjectPlatformProgress) => {
      // Remove the 'platform' key as we have titles
      const {platform, ...rest} = progress
      return makeHumanReadable(rest)
    }

    render(
      <App>
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
        <StatusTable title="iOS Status" statuses={progressToStatuses(iosPlatformStatus)} />
        <NextSteps steps={steps} />
      </App>,
    )
  }
}
