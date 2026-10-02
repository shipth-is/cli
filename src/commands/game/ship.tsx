import {Flags} from '@oclif/core'
import chalk from 'chalk'
import {Instance, render} from 'ink'

import {downloadBuildById, getJob, getProject, getSupportedGodotVersions} from '@cli/api/index.js'
import {BaseGameCommand} from '@cli/baseCommands/baseGameCommand.js'
import {CommandGame, Ship} from '@cli/components/index.js'
import {SUPPORTED_GODOT_VERSIONS} from '@cli/constants/index.js'
import {BuildType, Job} from '@cli/types/api.js'
import {getErrorMessage} from '@cli/utils/errors.js'
import {isCWDGodotGame} from '@cli/utils/godot.js'
import {validateDetailsValues} from '@cli/utils/validation.js'

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
    '<%= config.bin %> <%= command.id %> --platform android --dryRun',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4 --platform android',
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
      description: 'Download the APK artifact (if available) to the specified file. Can be used with --download',
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
    skipMultipart: Flags.boolean({
      default: false,
      description: 'Upload the zip in one request instead of several parts in parallel (slower, and limited to 5GB)',
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
      // Trim, as DetailsFlags does - what run() checks is what the job reads.
      parse: async (input: string) => input.trim(),
      required: false,
    }),
    dryRun: Flags.boolean({
      default: false,
      description: 'Dry run - lists the files that would be shipped without executing the build or publish steps',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    if (this.flags.downloadAPK && this.flags.platform !== 'android') {
      this.error('--downloadAPK is only for Android builds', {
        exit: 1,
        suggestions: ['Use --download to save the IPA'],
      })
    }

    // Checked before the zip and the upload, so a typo costs no wait. Without the flag there
    // is nothing to check, and the command asks the server nothing.
    const {gameEngineVersion} = this.flags
    const godotVersions = gameEngineVersion ? await getSupportedGodotVersions() : SUPPORTED_GODOT_VERSIONS
    const validationError = validateDetailsValues({gameEngineVersion}, godotVersions)
    if (validationError) {
      this.error(validationError.message, {
        exit: 1,
        ref: validationError.ref,
        suggestions: validationError.suggestions,
      })
    }

    if (!isCWDGodotGame()) {
      this.error('No Godot project detected. Please run this from a godot project directory.', {exit: 1})
    }

    // --gameId wins over shipthis.json, so shipthis.json is not required.
    const gameId = this.getGameId()
    if (!gameId) this.errorNoGame()

    // A wrong --gameId stops here, before the UI. Otherwise GameProvider and ship() both
    // report it.
    try {
      await getProject(gameId)
    } catch (error) {
      this.error(getErrorMessage(error), {exit: 1})
    }

    const MAX_RETRIES = 3
    const RETRY_DELAY_MS = 5000

    const handleComplete = async ([originalJob]: Job[]) => {
      if (!this.flags.download && !this.flags.downloadAPK) return process.exit(0)

      // The full UUID from the job - gameId can be a short --gameId.
      const projectId = originalJob.project.id
      let job: Job | null = null

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        job = await getJob(originalJob.id, projectId)
        if (job.builds && job.builds.length > 0) break
        if (attempt < MAX_RETRIES) await new Promise((res) => setTimeout(res, RETRY_DELAY_MS))
      }

      if (!job?.builds || job.builds.length === 0) this.error('No builds found for this job after multiple attempts')

      const {platform} = this.flags
      const downloads = [
        {file: this.flags.download, type: platform === 'android' ? BuildType.AAB : BuildType.IPA},
        {file: this.flags.downloadAPK, type: BuildType.APK},
      ].filter((d) => d.file)

      for (const {file, type} of downloads) {
        const build = job.builds.find((b) => b.buildType === type)
        if (!build) this.error(`No build found for type ${type}`)
        await downloadBuildById(projectId, build.id, file!)
      }

      process.exit(0)
    }

    // These two run after run() has resolved, so oclif no longer watches for a throw.
    // this.error() here reaches node as an uncaught exception, and node prints a stack
    // trace over the message the user needs. Both handlers therefore print the message
    // themselves and set the exit code.
    // The instance lives in an object so handleError can reach what render() returns below.
    const ui: {instance?: Instance} = {}

    // The Ship component has already shown the summary and the job logs
    const handleJobsFailed = () => {
      process.exit(1)
    }

    const handleError = (e: unknown) => {
      ui.instance?.unmount()
      process.stderr.write(`\n${chalk.red('Error:')} ${getErrorMessage(e)}\n`)
      process.exit(1)
    }

    ui.instance = render(
      <CommandGame command={this}>
        <Ship onComplete={handleComplete} onError={handleError} onFailure={handleJobsFailed} />
      </CommandGame>,
    )
  }
}
