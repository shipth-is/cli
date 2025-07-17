import {Flags} from '@oclif/core'
import {Box, render} from 'ink'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {AppleAppDetails, AppleBundleIdDetails, CommandGame, GameStatusDetails} from '@cli/components/index.js'
import {Platform} from '@cli/types/api.js'

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
        <GameStatusDetails
          gameId={game.id}
          onComplete={(exitCode) => {
            // TODO: this is a hack because the Apple components need time to load
            setTimeout(() => process.exit(exitCode), 2000)
          }}
          platforms={[Platform.IOS]}
        >
          <Box flexDirection='column' gap={0} marginTop={1}>
            <AppleAppDetails ctx={ctx} iosBundleId={game.details?.iosBundleId} />
            <AppleBundleIdDetails ctx={ctx} iosBundleId={game.details?.iosBundleId} />
          </Box>
        </GameStatusDetails>
      </CommandGame>,
    )
  }
}
