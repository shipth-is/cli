import {Flags} from '@oclif/core'

import {BaseGameCommand} from '@cli/baseCommands/index.js'

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
    await this.config.runCommand('game:status', ['--gameId', game.id, '--platform', 'android'])
  }
}
