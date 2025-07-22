import {Flags} from '@oclif/core'
import {render} from 'ink'

import {UserCertificate_iOS, getUserCredentials, uploadUserCredentials} from '@cli/api/credentials/index.js'
import {createCertificate, exportCertificate} from '@cli/apple/certificate.js'
import {BaseAppleCommand} from '@cli/baseCommands/index.js'
import {Command, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class AppleCertificateCreate extends BaseAppleCommand<typeof AppleCertificateCreate> {
  static override args = {}

  static override description =
    'Creates an iOS Distribution Certificate in your Apple Developer account.\nSaves the certificate with the private key to your ShipThis account'

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
      (cred) => cred.platform === Platform.IOS && cred.type === CredentialsType.CERTIFICATE,
    )

    if (userAppleDistCredentials.length > 0 && !force) {
      this.error('An Apple Distribution Certificate already exists. Use --force to overwrite it.')
    }

    const authState = await this.refreshAppleAuthState()
    const ctx = authState.context

    const createCert = async () => {
      const {certificate, privateKey} = await createCertificate(ctx)
      const exported = exportCertificate(certificate, privateKey)
      const {serialNumber} = certificate.attributes
      await uploadUserCredentials({
        contents: {
          serialNumber,
          ...exported,
        } as UserCertificate_iOS,
        platform: Platform.IOS,
        serialNumber,
        type: CredentialsType.CERTIFICATE,
      })
    }

    const handleComplete = async () => {
      await this.config.runCommand(`apple:certificate:status`)
    }

    if (this.flags.quiet) return await createCert()

    render(
      <Command command={this}>
        <RunWithSpinner
          executeMethod={createCert}
          msgComplete={`Certificate created and saved to ShipThis`}
          msgInProgress={`Creating certificate in the Apple Developer Portal...`}
          onComplete={handleComplete}
        />
      </Command>,
    )
  }
}
