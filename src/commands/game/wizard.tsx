import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {AndroidWizard, Command} from '@cli/components/index.js'
import {isCWDGodotGame} from '@cli/utils/godot.js'
import {Args} from '@oclif/core'
import {withFullScreen} from 'fullscreen-ink'

export default class GameWizard extends BaseAuthenticatedCommand<typeof GameWizard> {
  static override args = {
    platform: Args.string({
      description: 'The platform to run the wizard for. This can be "android" or "ios"',
      options: ['android', 'ios'],
      required: true,
    }),
  }

  static override description = 'Runs all the steps for the specific platform'

  static override examples = ['<%= config.bin %> <%= command.id %> ios', '<%= config.bin %> <%= command.id %> android']

  static override flags = {}

  public async run(): Promise<void> {
    const {args} = this

    if (!isCWDGodotGame()) {
      this.error('No Godot project detected. Please run this from a godot project directory.', {exit: 1})
    }

    if (args.platform === 'ios') {
      return this.config.runCommand('game:ios:wizard')
    }

    withFullScreen(
      <Command command={this}>
        <AndroidWizard onComplete={() => process.exit(0)} onError={(e) => this.error(e)} />
      </Command>,
    ).start()
  }
}
