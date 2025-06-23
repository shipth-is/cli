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
    downloadAPK: Flags.string({
      description: 'Download the APK artifact (if available) to the specified file',
      required: false,
      dependsOn: ['platform'],
    }),
    follow: Flags.boolean({
      description: 'Follow the job logs in real-time. Requires --platform to be specified.',
      required: false,
      dependsOn: ['platform'],
    }),
  }

  static override description = 'Builds the app (for all platforms with valid credentials) and ships it to the stores.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --platform ios',
    '<%= config.bin %> <%= command.id %> --platform android --skipPublish',
    '<%= config.bin %> <%= command.id %> --platform android --download game.aab',
    '<%= config.bin %> <%= command.id %> --platform android --follow --downloadAPK game.apk',
  ]

  public async run(): Promise<void> {
    await this.ensureWeAreInAProjectDir()
    const gameId = await this.getGameId()
    if (!gameId) {
      this.error('No game ID found')
    }

    const handleComplete = async ([job]: Job[]) => {
      if (!this.flags.download && !this.flags.downloadAPK) return process.exit(0)

      const builds = job.builds ?? []
      if (builds.length === 0) this.error('No builds found for this job')

      const platform = this.flags.platform
      const type = platform === 'android' ? (this.flags.downloadAPK ? 'APK' : 'AAB') : 'IPA'

      const build = builds.find((b) => b.buildType === type)
      if (!build) this.error(`No build found for type ${type}`)

      const filename = this.flags.download || this.flags.downloadAPK
      await downloadBuildById(gameId, build.id, `${filename}`)

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
