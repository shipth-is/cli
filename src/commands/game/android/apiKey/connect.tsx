import {Flags} from '@oclif/core'
import {render} from 'ink'

import {disconnectGoogle, getGoogleStatus} from '@cli/api/index.js'
import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {CommandGame, ConnectGoogle} from '@cli/components/index.js'

export default class GameAndroidApiKeyConnect extends BaseGameAndroidCommand<typeof GameAndroidApiKeyConnect> {
  static override args = {}

  static override description =
    'Connects ShipThis with Google for managing Service Account API Keys for an Android game'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --force',
    '<%= config.bin %> <%= command.id %> --disconnect',
  ]

  static override flags = {
    ...BaseGameAndroidCommand.flags,
    disconnect: Flags.boolean({char: 'd'}),
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const googleStatus = await getGoogleStatus()

    if (this.flags.disconnect) {
      if (!googleStatus.isAuthenticated && !this.flags.force) {
        throw new Error('You are not authenticated with Google. Use --force to disconnect anyway.')
      }

      await disconnectGoogle()
      this.log('Disconnected from Google.')
      return
    }

    if (googleStatus.isAuthenticated && !this.flags.force) {
      throw new Error('You are already authenticated with Google. Use --force to re-authenticate.')
    }

    render(
      <CommandGame command={this}>
        <ConnectGoogle helpPage={!this.flags.force} onComplete={() => process.exit(0)} onError={(e) => this.error(e)} />
      </CommandGame>,
    )
  }
}
