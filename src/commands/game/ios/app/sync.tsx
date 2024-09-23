import {render} from 'ink'
import {Flags} from '@oclif/core'

import {App, RunWithSpinner} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {fetchBundleId} from '@cli/utils/index.js'

import {CapabilityTypeOption} from '@cli/apple/expo.js'

export default class GameIosAppSync extends BaseGameCommand<typeof GameIosAppSync> {
  static override args = {}

  static override description =
    'Synchronies the Apple App "BundleId" with the capabilities from the local project. If --gameId is not provided it will look in the current directory.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const authState = await this.refreshAppleAuthState()
    const ctx = authState.context

    if (!game.details?.iosBundleId) return this.error('Please run `shipthis game ios app create` first')
    const {iosBundleId} = game.details

    const syncCapabilities = async () => {
      const bundleQueryResponse = await fetchBundleId({ctx, iosBundleId})
      const {bundleId, capabilities: existing, projectCapabilities} = bundleQueryResponse
      if (!bundleId) return this.error('BundleId not found')
      if (!projectCapabilities) return this.error('Project capabilities not loaded')

      // TODO: any more which cant be edited?
      // TODO: important - what if they have set some manually?? (prompt for confirmation?)
      const unRemovable = ['IN_APP_PURCHASE']
      const toRemove = existing.filter((c) => !projectCapabilities.includes(c) && !unRemovable.includes(c))
      const toAdd = projectCapabilities.filter((c) => !existing.includes(c))

      for (const capability of toRemove) {
        await bundleId.updateBundleIdCapabilityAsync({
          capabilityType: capability,
          option: CapabilityTypeOption.OFF,
        })
      }

      for (const capability of toAdd) {
        await bundleId.updateBundleIdCapabilityAsync({
          capabilityType: capability,
          option: CapabilityTypeOption.ON,
        })
      }
    }

    const handleComplete = async () => {
      await this.config.runCommand('game:ios:app:status', ['--gameId', game.id])
      process.exit(0)
    }

    render(
      <App>
        <RunWithSpinner
          msgInProgress="Syncing App Store BundleId capabilities"
          msgComplete="App Store BundleId capabilities synced"
          executeMethod={syncCapabilities}
          onComplete={handleComplete}
        />
      </App>,
    )
  }
}
