import {BaseAppleCommand} from '@cli/baseCommands/index.js'

import {Certificate, CertificateType} from '@cli/apple/expo.js'
import {getUseableCert} from '@cli/api/credentials/index.js'

export default class AppleCertificateStatus extends BaseAppleCommand<typeof AppleCertificateStatus> {
  static override args = {}

  static override description =
    'Displays the status of the Apple certificate on your account. This is used to sign all of your iOS apps.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const authState = await this.refreshAuthState()

    const ctx = authState.context

    // Get the certs from apple
    const appleCerts = await Certificate.getAsync(ctx, {
      query: {
        filter: {
          certificateType: [CertificateType.DISTRIBUTION, CertificateType.IOS_DISTRIBUTION],
        },
      },
    })

    // Show a table of the apple ones?

    // Find which of them (if any) are useable (we have the private key in the shipthis account)
    const userCert = await getUseableCert(appleCerts)

    // TODO: next steps - if they dont have a cert then create or import

    console.log('userCert', userCert)
  }
}
