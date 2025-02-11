import {render} from 'ink'
import {Flags} from '@oclif/core'

import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {getGoogleStatus} from '@cli/api/index.js'
import {ConnectGoogle, CommandGame} from '@cli/components/index.js'

export default class GameAndroidApiKeyConnect extends BaseGameAndroidCommand<typeof GameAndroidApiKeyConnect> {
  static override args = {}

  static override description =
    'Connects ShipThis with Google for managing Service Account API Keys for an Android game'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    ...BaseGameAndroidCommand.flags,
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const googleStatus = await getGoogleStatus()

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
