import {render} from 'ink'
import {Flags} from '@oclif/core'

import {App, NextSteps, StatusTable} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProjectPlatformProgress} from '@cli/api/index.js'
import {Platform, ProjectPlatformProgress} from '@cli/types.js'
import {getShortDate, getShortUUID, makeHumanReadable} from '@cli/utils/index.js'

export default class GameStatus extends BaseGameCommand<typeof GameStatus> {
  static override args = {}

  static override description =
    'Shows the Game status. If --gameId is not provided it will look in the current directory.'

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
    const androidPlatformStatus = await getProjectPlatformProgress(game.id, Platform.ANDROID)

    // TODO: what if they have not yet connected to apple?
    // TODO: what do do if they have credentials?
    const steps = [
      iosPlatformStatus.hasBundleSet == false && '$ shipthis game ios app create',
      androidPlatformStatus.hasBundleSet == false && '$ shipthis game android setup',
    ].filter(Boolean) as string[]

    const progressToStatuses = (progress: ProjectPlatformProgress) => {
      // Remove the 'platform' key as we have titles
      const {platform, ...rest} = progress
      return makeHumanReadable(rest);
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
        <StatusTable marginBottom={1} title="iOS Status" statuses={progressToStatuses(iosPlatformStatus)} />
        <StatusTable marginBottom={1} title="Android Status" statuses={progressToStatuses(androidPlatformStatus)} />
        <NextSteps steps={steps} />
      </App>,
    )
  }
}
