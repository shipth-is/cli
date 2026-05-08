import {Args} from '@oclif/core'
import {render} from 'ink'

import {getUserCredentials} from '@cli/api/credentials/index.js'
import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {Command, CredentialDetailsView} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class AppleCertificateShow extends BaseAuthenticatedCommand<typeof AppleCertificateShow> {
  static override args = {
    id: Args.string({
      description: 'Credential ID (full or short prefix). Defaults to the active credential.',
      required: false,
    }),
  }

  static override description =
    'Shows expanded details (expiry) for an iOS Distribution Certificate in your ShipThis account.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> 6ff5a864',
  ]

  public async run(): Promise<void> {
    const {args} = this
    const credentials = await getUserCredentials()
    const iosCerts = credentials.filter(
      (c) => c.platform === Platform.IOS && c.type === CredentialsType.CERTIFICATE,
    )

    const match = args.id
      ? iosCerts.find((c) => c.id === args.id || c.id.startsWith(args.id!))
      : iosCerts.find((c) => c.isActive)

    if (!match) {
      this.error(
        args.id
          ? `No credential found matching ID/prefix: ${args.id}`
          : 'No active credential',
      )
    }

    render(
      <Command command={this}>
        <CredentialDetailsView
          credential={match}
          title="Apple iOS Distribution Certificate"
        />
      </Command>,
    )
  }
}
