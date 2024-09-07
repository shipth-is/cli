import {colorize, stderr} from '@oclif/core/ux'

import {BaseCommand} from '@cli/baseCommands/index.js'

export default class AppleStatus extends BaseCommand<typeof AppleStatus> {
  static override args = {}

  static override description = 'Shows the current Apple Overall status'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    try {
      this.log('TODO: AppleStatus')
      this.exit(0)
    } catch (err: any) {
      stderr(colorize('#FF0000', err.message))
      this.exit(1)
    }
  }
}
