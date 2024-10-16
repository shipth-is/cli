import {render} from 'ink'
import {Flags} from '@oclif/core'

import {App, RunWithSpinner} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getInput, getGodotAppleBundleIdentifier} from '@cli/utils/index.js'

import {App as AppleApp, BundleId as AppleBundleId} from '@cli/apple/expo.js'

export default class GameIosAppCreate extends BaseGameCommand<typeof GameIosAppCreate> {
  static override args = {}

  static override description =
    'Creates an App and BundleId in the Apple Developer Portal. If --gameId is not provided it will look in the current directory.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    appName: Flags.string({char: 'n', description: 'The name of the App in the Apple Developer Portal'}),
    bundleId: Flags.string({char: 'b', description: 'The BundleId in the Apple Developer Portal'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const authState = await this.refreshAppleAuthState()
    const ctx = authState.context

    const {flags} = this
    const {appName, bundleId} = flags

    const getAppName = async (): Promise<string> => {
      if (appName) return appName
      const suggestedName = game.name
      const question = `Please enter the name of the App in the Apple Developer Portal, or press enter to use ${suggestedName}: `
      const enteredName = await getInput(question)
      return enteredName || suggestedName
    }

    const getBundleIdentifier = async (): Promise<string> => {
      if (bundleId) return bundleId
      // TODO: autogenerate a bundle id from current user name and random words - or the game name?
      const suggestedBundleId = game.details?.iosBundleId || getGodotAppleBundleIdentifier() || 'com.example.app'
      const question = `Please enter the BundleId in the Apple Developer Portal, or press enter to use ${suggestedBundleId}: `
      const enteredBundleId = await getInput(question)
      return enteredBundleId || suggestedBundleId
    }

    const name = await getAppName()
    const iosBundleId = await getBundleIdentifier()

    const createApp = async () => {
      this.log(`Checking for ${iosBundleId} in apple portal...`)

      // TODO: handling for app already existing
      let bundleId = await AppleBundleId.findAsync(ctx, {identifier: iosBundleId})
      if (!bundleId) {
        this.log(`Creating BundleId ${iosBundleId} in apple portal...`)
        bundleId = await AppleBundleId.createAsync(ctx, {
          identifier: iosBundleId,
          name,
        })
      }

      // See if the app already exists
      let app = await AppleApp.findAsync(ctx, {
        bundleId: iosBundleId,
      })

      if (!app) {
        this.log(`Creating App ${iosBundleId} in apple portal...`)
        app = await AppleApp.createAsync(ctx, {
          bundleId: iosBundleId,
          name,
          primaryLocale: 'en-US', // TODO
        })
      }

      // Update the project with the iosBundleId
      await this.updateGame({details: {...game.details, iosBundleId}})

      // TODO: if the bundleId or name are different in the export_presets.cfg, update it
    }

    const handleComplete = async () => {
      // TODO: this doesn't work correctly?
      await this.config.runCommand('game:ios:app:sync', ['--gameId', game.id])
      // TODO: without this it hangs?
      process.exit(0)
    }

    if (this.flags.quiet) {
      await createApp()
      return this.exit(0)
    }

    render(
      <App>
        <RunWithSpinner
          msgInProgress="Creating App and BundleId in the Apple Developer Portal"
          msgComplete="App and BundleId created"
          executeMethod={createApp}
          onComplete={handleComplete}
        />
      </App>,
    )
  }
}
