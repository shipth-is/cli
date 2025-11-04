import {Flags} from '@oclif/core'
import {render} from 'ink'

import {downloadBuildById, getJob} from '@cli/api/index.js'
import {BaseGameCommand} from '@cli/baseCommands/baseGameCommand.js'
import {CommandGame, Ship} from '@cli/components/index.js'
import {Job} from '@cli/types/api.js'
import {getErrorMessage} from '@cli/utils/errors.js'

export default class GameShip extends BaseGameCommand<typeof GameShip> {
  static override args = {}

  static override description = 'Builds and publishes your ShipThis game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --platform ios',
    '<%= config.bin %> <%= command.id %> --platform android --skipPublish',
    '<%= config.bin %> <%= command.id %> --platform android --download game.aab',
    '<%= config.bin %> <%= command.id %> --platform android --follow --downloadAPK game.apk',
    '<%= config.bin %> <%= command.id %> --platform ios --follow --verbose',
    '<%= config.bin %> <%= command.id %> --platform ios --useDemoCredentials --download game.ipa',
    '<%= config.bin %> <%= command.id %> --platform android --gameEngineVersion 4.5.1 --skipPublish',
  ]

  static override flags = {
    ...BaseGameCommand.flags,
    download: Flags.string({
      dependsOn: ['platform'],
      description: 'Download the build artifact to the specified file',
      required: false,
    }),
    downloadAPK: Flags.string({
      dependsOn: ['platform'],
      description: 'Download the APK artifact (if available) to the specified file',
      required: false,
    }),
    follow: Flags.boolean({
      dependsOn: ['platform'],
      description: 'Follow the job logs in real-time (requires --platform)',
      required: false,
    }),
    platform: Flags.string({
      description: 'The platform to ship the game to. This can be "android" or "ios"',
      options: ['android', 'ios'],
      required: false,
    }),
    skipPublish: Flags.boolean({
      default: false,
      description: 'Skip the publish step',
      required: false,
    }),
    verbose: Flags.boolean({
      default: false,
      description: 'Enable verbose logging',
      required: false,
    }),
    useDemoCredentials: Flags.boolean({
      dependsOn: ['platform'],
      description: 'Use demo credentials for this build (requires --platform, implies --skipPublish)',
      required: false,
    }),
    gameEngineVersion: Flags.string({
      description: 'Override the specified game engine version for this build',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    await this.ensureWeAreInAProjectDir()
    const gameId = this.getGameId()
    if (!gameId) {
      this.error('No game ID found')
    }

    const MAX_RETRIES = 3
    const RETRY_DELAY_MS = 5000

    const handleComplete = async ([originalJob]: Job[]) => {
      if (!this.flags.download && !this.flags.downloadAPK) return process.exit(0)

      let job: Job | null = null

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        job = await getJob(originalJob.id, gameId)
        if (job.builds && job.builds.length > 0) break
        if (attempt < MAX_RETRIES) await new Promise((res) => setTimeout(res, RETRY_DELAY_MS))
      }

      if (!job?.builds || job.builds.length === 0) this.error('No builds found for this job after multiple attempts')

      const {platform} = this.flags
      const type = platform === 'android' ? (this.flags.downloadAPK ? 'APK' : 'AAB') : 'IPA'

      const build = job.builds.find((b) => b.buildType === type)
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
