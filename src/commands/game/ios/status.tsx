import {render} from 'ink'
import {Flags} from '@oclif/core'

import {App, AppleAppDetails, AppleBundleIdDetails, NextSteps, StatusTable} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProjectPlatformProgress} from '@cli/api/index.js'
import {Platform, ProjectPlatformProgress} from '@cli/types.js'
import {getShortDate, getShortUUID} from '@cli/utils/index.js'

export default class GameIosStatus extends BaseGameCommand<typeof GameIosStatus> {
  static override args = {}

  static override description =
    'Shows the Game iOS Platform status. If --gameId is not provided it will look in the current directory.'

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

    const gameStatuses = {
      name: game.name,
      id: getShortUUID(game.id),
      createdAt: getShortDate(game.createdAt),
      engine: 'Godot',
    }
    // TODO: what if they have not yet connected to apple?
    // TODO: what do do if they have credentials?
    const steps = [iosPlatformStatus.hasBundleSet == false && '$ shipthis game ios app create'].filter(
      Boolean,
    ) as string[]

    const progressToStatuses = (progress: ProjectPlatformProgress) => {
      // Remove the 'platform' key as we have titles
      const {platform, ...rest} = progress
      return rest as {[key: string]: string | boolean}
    }

    const authState = await this.refreshAppleAuthState()
    const ctx = authState.context

    render(
      <App>
        <StatusTable marginBottom={1} title="Shipthis game status" statuses={gameStatuses} />

        <StatusTable
          marginBottom={1}
          title="Overall iOS status for game"
          statuses={progressToStatuses(iosPlatformStatus)}
        />

        <AppleAppDetails iosBundleId={game.details?.iosBundleId} ctx={ctx} />
        <AppleBundleIdDetails iosBundleId={game.details?.iosBundleId} ctx={ctx} />

        <NextSteps steps={steps} />
      </App>,
    )
  }
}
