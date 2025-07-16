import {render} from 'ink'
import {Flags} from '@oclif/core'

import {CommandGame, GameStatus as GameStatusComponent} from '@cli/components/index.js'
import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'

export default class GameStatus extends BaseAuthenticatedCommand<typeof GameStatus> {
  static override args = {}

  static override description = 'Shows the status of the current game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
    '<%= config.bin %> <%= command.id %> --platform ios',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    platform: Flags.string({
      char: 'p',
      description: 'The platform to check status for (ios, android)',
      options: ['android', 'ios'],
    }),
  }

  public async run(): Promise<void> {
    const gameId = await this.getGameId()
    if (!gameId) {
      this.error('No game found - please run `shipthis game wizard` or specify a game ID with --gameId', {exit: 1})
    }

    render(
      <CommandGame command={this}>
        <GameStatusComponent onComplete={(exitCode) => process.exit(exitCode)} />
      </CommandGame>,
    )
  }
}
