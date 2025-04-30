import {Flags} from '@oclif/core'
import {render} from 'ink'

import {BaseGameCommand} from '@cli/baseCommands/baseGameCommand.js'
import {CommandGame, Ship} from '@cli/components/index.js'
import {getErrorMessage} from '@cli/utils/errors.js'
import {Job} from '@cli/types/api.js'
import {downloadBuildById} from '@cli/api/index.js'

export default class GameShip extends BaseGameCommand<typeof GameShip> {
  static override args = {}

  static override flags = {
    ...BaseGameCommand.flags,
    platform: Flags.string({
      description: 'The platform to ship the game to. This can be "android" or "ios"',
      required: false,
      options: ['android', 'ios'],
    }),
    skipPublish: Flags.boolean({
      description: 'Skip the publish step',
      required: false,
      default: false,
    }),
    download: Flags.string({
      description: 'Download the build artifact to the specified file',
      required: false,
      dependsOn: ['platform'],
    }),
  }

  static override description = 'Builds the app (for all platforms with valid credentials) and ships it to the stores.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --platform ios',
    '<%= config.bin %> <%= command.id %> --platform android --skipPublish',
    '<%= config.bin %> <%= command.id %> --platform android --download output.aab',
  ]

  public async run(): Promise<void> {
    await this.ensureWeAreInAProjectDir()
    const gameId = await this.getGameId()
    if (!gameId) {
      this.error('No game ID found')
    }

    const handleComplete = async (jobs: Job[]) => {
      if (this.flags.download) {
        // this only runs with the platform flag - so only one job
        await downloadBuildById(gameId, `${jobs[0]?.build?.id}`, this.flags.download)
      }
      process.exit(0)
    }

    const handleError = (e: Error) => {
      this.error(getErrorMessage(e))
    }

    render(
      <CommandGame command={this}>
        <Ship onComplete={handleComplete} onError={handleError} />
      </CommandGame>,
    )
  }
}
