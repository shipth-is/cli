import {Flags} from '@oclif/core'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProjectCredentials} from '@cli/api/index.js'
import {CredentialsType, Platform} from '@cli/types'

import {getInput, getGodotAppleBundleIdentifier, generatePackageName} from '@cli/utils/index.js'

export default class GameAndroidSetup extends BaseGameCommand<typeof GameAndroidSetup> {
  static override args = {}

  static override description = 'Runs the full setup for the Android platform for a specific game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    packageName: Flags.string({char: 'a', description: 'Set the Android package name'}),
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()

    const {flags} = this
    const {packageName, force} = flags

    if (game.details?.androidPackageName && !force) {
      this.error('An androidPackageName is already set on this game. Use --force to overwrite it.')
    }

    const getPackageName = async (): Promise<string> => {
      if (packageName) return packageName
      const generatedBundleId = generatePackageName(game.name)
      const suggestedBundleId =
        game.details?.iosBundleId || getGodotAppleBundleIdentifier() || generatedBundleId || 'com.example.game'
      const question = `Please enter the Android Package Name, or press enter to use ${suggestedBundleId}: `
      const enteredBundleId = await getInput(question)
      return enteredBundleId || suggestedBundleId
    }

    const androidPackageName = await getPackageName()

    const runSetup = async () => {
      // Update the project with the androidPackageName
      await this.updateGame({details: {...game.details, androidPackageName}})

      // Create a keystore using the other command if we don't have an active one
      const projectCredentials = await getProjectCredentials(game.id)
      const hasKeyStore = projectCredentials.some(
        (cred) => cred.platform == Platform.ANDROID && cred.isActive && cred.type == CredentialsType.CERTIFICATE,
      )
      if (!hasKeyStore) await this.config.runCommand('game:android:keyStore:create', ['--gameId', game.id])

      console.log('TODOD')
    }

    await runSetup()
  }
}
