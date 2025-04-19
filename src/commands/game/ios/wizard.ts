import {Flags} from '@oclif/core'
import chalk from 'chalk'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {isCWDGodotGame} from '@cli/utils/godot.js'
import {getProjectCredentials, getUserCredentials} from '@cli/api/index.js'
import {CredentialsType, Platform} from '@cli/types'
import {getRenderedMarkdown} from '@cli/components/index.js'
import {WEB_URL} from '@cli/constants/config.js'

interface Step {
  command: string
  args: string[]
  shouldRun: () => Promise<boolean>
}

export default class GameIosWizard extends BaseAuthenticatedCommand<typeof GameIosWizard> {
  static override args = {}
  static override description = 'Runs all the steps for iOS'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {
    forceStep: Flags.string({
      char: 'f',
      description: 'Force a specific step to run.',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = this

    if (!isCWDGodotGame()) {
      this.error(
        'No Godot project detected. Please run this from a Godot project directory with a project.godot file.',
        {exit: 1},
      )
    }

    const projectConfig = await this.getProjectConfigSafe()
    const game = projectConfig.project

    const isStepForced = (cmdName: string) => flags.forceStep?.includes(cmdName)

    const logSkip = (cmdName: string) => this.log(chalk.blue(`[skip] shipthis ${cmdName.replaceAll(':', ' ')}`))
    const logRun = (cmdName: string, args: string[]) =>
      this.log(chalk.green(`[run] shipthis ${cmdName.replaceAll(':', ' ')} ${args.join(' ')}`))

    // TODO: some duplication in the shouldRun logic and the commands themselves - perhaps we could refactor this
    const iosSteps: Step[] = [
      {
        command: 'game:create',
        args: ['--quiet'],
        shouldRun: async () => !game,
      },
      {
        command: 'apple:login',
        args: ['--quiet'],
        shouldRun: async () => {
          const isLoggedIn = await this.hasValidAppleAuthState()
          return !isLoggedIn
        },
      },
      {
        command: 'apple:apiKey:create',
        args: ['--quiet'],
        shouldRun: async () => {
          // TODO: this doesn't tell us if the key is valid or usable (since we don't query Apple for that here)
          const userCredentials = await getUserCredentials()
          const userAppleApiKeyCredentials = userCredentials.filter(
            (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.KEY,
          )
          const hasKey = userAppleApiKeyCredentials.length > 0
          return !hasKey
        },
      },
      {
        command: 'apple:certificate:create',
        args: ['--quiet'],
        shouldRun: async () => {
          // TODO: this doesn't tell us if the certificate is valid or usable (since we don't query Apple for that here)
          const userCredentials = await getUserCredentials()
          const userAppleDistCredentials = userCredentials.filter(
            (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.CERTIFICATE,
          )
          const hasDistCert = userAppleDistCredentials.length > 0
          return !hasDistCert
        },
      },
      {
        command: 'game:ios:app:create',
        args: ['--quiet'],
        shouldRun: async () => {
          if (!game) return true
          const hasBundleIdSet = !!game.details?.iosBundleId
          // Assume that this has run if the bundle id is set in the config
          // The command will check if it exists in Apple before creating it
          return !hasBundleIdSet
        },
      },
      {
        command: 'game:ios:app:sync',
        args: ['--quiet'],
        // Can always run this
        shouldRun: async () => true,
      },
      {
        command: 'game:ios:profile:create',
        args: ['--quiet'],
        shouldRun: async () => {
          // Again - should we call Apple here?
          if (!game) return true
          const projectCredentials = await getProjectCredentials(game.id)
          const projectAppleProfileCredentials = projectCredentials.filter(
            (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.CERTIFICATE,
          )
          const hasProfile = projectAppleProfileCredentials.length > 0
          return !hasProfile
        },
      },
    ]

    for (const step of iosSteps) {
      const command = step.command
      const willRun = isStepForced(command) || (await step.shouldRun())
      if (!willRun) {
        logSkip(command)
        continue
      }

      const args = [...step.args, ...(isStepForced(command) ? ['--force'] : [])]
      logRun(command, args)
      await this.config.runCommand(command, args)
    }

    const successMessage = getRenderedMarkdown({
      filename: 'ios-success.md',
      templateVars: {
        androidSetupURL: new URL('/docs/android', WEB_URL).toString(),
        docsURL: new URL('/docs', WEB_URL).toString(),
      },
    })

    this.log(`\n${successMessage}\n`)
  }
}
