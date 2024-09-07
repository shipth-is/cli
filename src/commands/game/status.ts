import {colorize, stderr} from '@oclif/core/ux'

import {BaseCommand} from '@cli/baseCommands/index.js'

export default class GameStatus extends BaseCommand<typeof GameStatus> {
  static override args = {}

  static override description = 'Shows the current Game status'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    //
  }
}
