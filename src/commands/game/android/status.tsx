import {render} from 'ink'
import {Flags} from '@oclif/core'

import {Command, NextSteps, StatusTable} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProjectPlatformProgress} from '@cli/api/index.js'
import {Platform, ProjectPlatformProgress} from '@cli/types'
import {getShortDate, getShortUUID, makeHumanReadable} from '@cli/utils/index.js'

export default class GameAndroidStatus extends BaseGameCommand<typeof GameAndroidStatus> {
  static override args = {}

  static override description = 'Shows the status of the setup for the Android platform for a specific game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }
  public async run(): Promise<void> {
    const game = await this.getGame()
    const platformStatus = await getProjectPlatformProgress(game.id, Platform.ANDROID)

    const gameStatuses = {
      name: game.name,
      id: getShortUUID(game.id),
      createdAt: getShortDate(game.createdAt),
      engine: 'Godot',
    }
    const steps = [
      (platformStatus.hasBundleSet == false ||
        platformStatus.hasApiKeyForPlatform == false ||
        platformStatus.hasCredentialsForPlatform == false) &&
        '$ shipthis game android setup',
    ].filter(Boolean) as string[]

    const progressToStatuses = (progress: ProjectPlatformProgress) => {
      // Remove the 'platform' key as we have titles
      const {platform, ...rest} = progress
      return makeHumanReadable(rest)
    }

    render(
      <Command command={this}>
        <StatusTable marginBottom={1} title="ShipThis game status" statuses={gameStatuses} />
        <StatusTable
          marginBottom={1}
          title="Overall Android status for game"
          statuses={progressToStatuses(platformStatus)}
        />
        <NextSteps steps={steps} />
      </Command>,
    )
  }
}
