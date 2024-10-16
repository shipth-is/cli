import {Flags} from '@oclif/core'
import {render} from 'ink'

import {BaseAppleCommand} from '@cli/baseCommands/index.js'
import {getUserCredentials, uploadUserCredentials, UserCertificate_iOS} from '@cli/api/credentials/index.js'
import {App, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types.js'
import {createCertificate, exportCertificate} from '@cli/apple/certificate.js'

export default class AppleCertificateCreate extends BaseAppleCommand<typeof AppleCertificateCreate> {
  static override args = {}

  static override description =
    'Creates an iOS Distribution Certificate in your Apple Developer account and saves it with the private key to your ShipThis account'

  static override examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --force']

  static override flags = {
    force: Flags.boolean({char: 'f'}),
    quiet: Flags.boolean({char: 'q', description: 'Avoid output except for interactions and errors'}),
  }

  public async run(): Promise<void> {
    const {flags} = this
    const {force} = flags

    const userCredentials = await getUserCredentials()
    const userAppleDistCredentials = userCredentials.filter(
      (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.CERTIFICATE,
    )

    if (userAppleDistCredentials.length !== 0 && !force) {
      this.error('An Apple Distribution Certificate already exists. Use --force to overwrite it.')
    }

    const authState = await this.refreshAppleAuthState()
    const ctx = authState.context

    const createCert = async () => {
      const {certificate, privateKey} = await createCertificate(ctx)
      const exported = exportCertificate(certificate, privateKey)
      const serialNumber = certificate.attributes.serialNumber
      await uploadUserCredentials({
        platform: Platform.IOS,
        type: CredentialsType.CERTIFICATE,
        contents: {
          serialNumber,
          ...exported,
        } as UserCertificate_iOS,
        serialNumber,
      })
    }

    const handleComplete = async () => {
      await this.config.runCommand(`apple:certificate:status`)
    }

    if (this.flags.quiet) return await createCert()

    render(
      <App>
        <RunWithSpinner
          msgInProgress={`Creating certificate in the Apple Developer Portal...`}
          msgComplete={`Certificate created and saved to ShipThis`}
          executeMethod={createCert}
          onComplete={handleComplete}
        />
      </App>,
    )
  }
}
