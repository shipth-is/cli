import {Flags} from '@oclif/core'
import {render} from 'ink'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {App, AppleCertificatesTable, NextSteps, UserCredentialsTable} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class AppleCertificateStatus extends BaseAuthenticatedCommand<typeof AppleCertificateStatus> {
  static override args = {}

  static override description =
    'Displays the status of the iOS Distribution certificates in your Apple and ShipThis accounts. These are used to sign all of your iOS apps.'

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
      <App>
        <UserCredentialsTable
          credentialTypeName="Apple iOS Distribution Certificate"
          queryProps={{type: CredentialsType.CERTIFICATE, platform: Platform.IOS}}
        />

        {showApple && <AppleCertificatesTable ctx={ctx} />}

        <NextSteps steps={[]} />
      </App>,
    )
  }
}
