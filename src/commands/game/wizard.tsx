import {Flags} from '@oclif/core'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'

export default class GameWizard extends BaseAuthenticatedCommand<typeof GameWizard> {
  static override args = {}

  static override description = 'Runs all the steps for the specific platform'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    platform: Flags.string({char: 'p', description: 'The platform to target'}),
  }

  public async run(): Promise<void> {
    // TODO: do something with the platform

    const commands = [
      'game:create',
      'apple:login',
      'apple:apiKey:create',
      'apple:certificate:create',
      'game:ios:app:create',
      'game:ios:app:sync',
      'game:ios:profile:create',
    ]

    for (const command of commands) {
      await this.config.runCommand(command, ['--quiet'])
    }

    // We finish with the game status
    await this.config.runCommand('game:status')
  }
}
