import {render} from 'ink'
import {Flags} from '@oclif/core'

import {AppleAppDetails, AppleBundleIdDetails, GameStatus, CommandGame} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'

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

    const authState = await this.refreshAppleAuthState()
    const ctx = authState.context

    render(
      <CommandGame command={this}>
        <GameStatus onComplete={(exitCode) => {
          // TODO: this is a hack because the Apple components need time to load
          setTimeout(() => process.exit(exitCode), 2000)
        }}>
          <AppleAppDetails iosBundleId={game.details?.iosBundleId} ctx={ctx} />
          <AppleBundleIdDetails iosBundleId={game.details?.iosBundleId} ctx={ctx} />
        </GameStatus>
      </CommandGame>,
    )
  }
}
