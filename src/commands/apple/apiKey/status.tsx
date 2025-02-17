import {Flags} from '@oclif/core'
import {render} from 'ink'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {Command, AppleApiKeysTable, UserCredentialsTable} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class AppleApiKeyStatus extends BaseAuthenticatedCommand<typeof AppleApiKeyStatus> {
  static override args = {}

  static override description =
    'Displays the status of App Store Connect API Keys in your Apple and ShipThis accounts.\nThis API key is used to automatically publish your games to the App Store.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --noAppleAuth',
  ]

  static override flags = {
    noAppleAuth: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const {flags} = this

    const showApple = !flags.noAppleAuth

    let ctx = null

    if (showApple) {
      const authState = await this.refreshAppleAuthState()
      ctx = authState.context
    }

    render(
      <Command command={this}>
        <UserCredentialsTable
          credentialTypeName="App Store Connect API Key"
          queryProps={{type: CredentialsType.KEY, platform: Platform.IOS}}
        />

        {showApple && <AppleApiKeysTable ctx={ctx} />}
      </Command>,
    )
  }
}
