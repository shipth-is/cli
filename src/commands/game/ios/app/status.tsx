import {render} from 'ink'
import {Flags} from '@oclif/core'

import {Command, AppleAppDetails, AppleBundleIdDetails, NextSteps} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'

export default class GameIosAppStatus extends BaseGameCommand<typeof GameIosAppStatus> {
  static override args = {}

  static override description = 'Shows the Game iOS App status. '

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const authState = await this.refreshAppleAuthState()
    const ctx = authState.context

    // TODO
    const steps: string[] = []

    render(
      <Command command={this}>
        <AppleAppDetails iosBundleId={game.details?.iosBundleId} ctx={ctx} />
        <AppleBundleIdDetails iosBundleId={game.details?.iosBundleId} ctx={ctx} />

        <NextSteps steps={steps} />
      </Command>,
    )
  }
}
