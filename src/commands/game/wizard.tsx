import {Args} from '@oclif/core'
import chalk from 'chalk'
import {withFullScreen} from 'fullscreen-ink'
import {render} from 'ink'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {AndroidWizard, Command, ShipFailure} from '@cli/components/index.js'
import {Job} from '@cli/types/index.js'
import {JobFailedError, getErrorMessage} from '@cli/utils/errors.js'
import {isCWDGodotGame} from '@cli/utils/godot.js'

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

    // The wizard draws in the alternate screen buffer, which the terminal discards
    // on exit, so anything worth keeping is printed after the UI closes.
    const ui: {ink?: ReturnType<typeof withFullScreen>} = {}

    const closeUI = async () => {
      ui.ink?.instance.unmount()
      // Resolves once the alternate buffer has closed
      await ui.ink?.waitUntilExit()
    }

    const handleComplete = async () => {
      await closeUI()
      process.exit(0)
    }

    // Runs after run() resolved, so this.error() would reach node as an uncaught
    // exception and kill the process before the buffer closes.
    const handleError = async (error: Error) => {
      await closeUI()
      if (error instanceof JobFailedError) await this.showJobFailure(error.job)
      else process.stderr.write(`\n${chalk.red('Error:')} ${getErrorMessage(error)}\n`)
      process.exit(1)
    }

    ui.ink = withFullScreen(
      <Command command={this}>
        <AndroidWizard onComplete={handleComplete} onError={handleError} />
      </Command>,
    )
    await ui.ink.start()
  }

  // The same summary `game ship` shows, in the normal buffer so it survives the exit
  private async showJobFailure(job: Job): Promise<void> {
    const failureUI = render(
      <Command command={this}>
        <ShipFailure
          failedJobs={[job]}
          gameId={job.project.id}
          onLogsLoaded={() => failureUI.unmount()}
          showLogTail={true}
        />
      </Command>,
    )

    // unmount() paints the final frame before it resolves this
    await failureUI.waitUntilExit()
  }
}
