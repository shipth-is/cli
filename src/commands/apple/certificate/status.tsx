import {Flags} from '@oclif/core'
import {render} from 'ink'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {AppleCertificatesTable, Command, UserCredentialsTable} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class AppleCertificateStatus extends BaseAuthenticatedCommand<typeof AppleCertificateStatus> {
  static override args = {}

  static override description =
    'Displays the status of the iOS Distribution certificates in your Apple and ShipThis accounts.\nThese are used to sign all of your iOS apps.'

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
          credentialTypeName="Apple iOS Distribution Certificate"
          queryProps={{platform: Platform.IOS, type: CredentialsType.CERTIFICATE}}
        />

        {showApple && <AppleCertificatesTable ctx={ctx} />}
      </Command>,
    )
  }
}
