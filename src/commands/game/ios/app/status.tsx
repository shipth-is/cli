import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {AppleAppDetails, AppleBundleIdDetails, Command, NextSteps} from '@cli/components/index.js'
import {Flags} from '@oclif/core'
import {render} from 'ink'

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
        <AppleAppDetails ctx={ctx} iosBundleId={game.details?.iosBundleId} />
        <AppleBundleIdDetails ctx={ctx} iosBundleId={game.details?.iosBundleId} />

        <NextSteps steps={steps} />
      </Command>,
    )
  }
}
