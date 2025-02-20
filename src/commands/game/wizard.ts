import {Args} from '@oclif/core'
import prompts from 'prompts'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {isCWDGodotGame} from '@cli/utils/godot.js'
import {Platform} from '@cli/types/api.js'

export default class GameWizard extends BaseAuthenticatedCommand<typeof GameWizard> {
  static override args = {
    platform: Args.string({
      description: 'The platform to run the wizard for. This can be "android" or "ios"',
      required: false,
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

    const runForPlatform = async (platform: Platform) => {
      console.clear()
      if (platform === Platform.ANDROID) {
        return this.config.runCommand('game:android:wizard')
      } else if (platform === Platform.IOS) {
        return this.config.runCommand('game:ios:wizard')
      }
      process.exit(0)
    }

    if (args.platform) {
      await runForPlatform(args.platform as Platform)
      return
    }

    const response = await prompts({
      type: 'select',
      name: 'platform',
      message: 'Please select a platform',
      choices: [
        {title: 'Android', value: Platform.ANDROID},
        {title: 'iOS', value: Platform.IOS},
      ],
      initial: 0,
    })

    await runForPlatform(response.platform)
  }
}
