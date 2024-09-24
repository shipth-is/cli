import {render, Text} from 'ink'
import {Flags} from '@oclif/core'

import {App} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'

export default class GameBuildNumber extends BaseGameCommand<typeof GameBuildNumber> {
  static override args = {}

  static override description =
    'Shows and sets the game Build Number. If --gameId is not provided it will look in the current directory.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
    '<%= config.bin %> <%= command.id %> --set 5',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    set: Flags.integer({char: 'n', description: 'Set the build number'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const {flags} = this

    if (!flags.set) {
      const currentBuildNumber = (game?.details?.buildNumber as number) || 1
      render(
        <App>
          <Text>{`The current build number is ${currentBuildNumber}`}</Text>
        </App>,
      )
      return
    }

    const newBuildNumber = flags.set

    await this.updateGame({
      details: {
        ...game.details,
        buildNumber: newBuildNumber,
      },
    })

    render(
      <App>
        <Text>{`Build number set to ${newBuildNumber}`}</Text>
      </App>,
    )
    return
  }
}
