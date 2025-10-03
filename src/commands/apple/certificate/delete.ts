import {Flags} from '@oclif/core'

import {BaseAppleCommand} from '@cli/baseCommands/index.js'
import {deleteUserCredential, getUserCredentials} from '@cli/api/index.js'
import {getRenderedMarkdown} from '@cli/components/common/index.js'

import {Certificate, CertificateType} from '@cli/apple/expo.js'
import {CredentialsType, Platform} from '@cli/types'
import {getInput, getShortUUID} from '@cli/utils/index.js'
import { ConnectQueryParams } from 'connect/ConnectAPI'

export default class AppleCertificateDelete extends BaseAppleCommand<typeof AppleCertificateDelete> {
  static override args = {}
  static override description = 'Delete an iOS Distribution Certificate from ShipThis and optionally from Apple'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {
    immediate: Flags.boolean({
      char: 'i',
      description: 'Remove from storage immediately (rather than waiting for automatic cleanup - cannot be undone)',
      required: false,
    }),
    iAmSure: Flags.boolean({
      char: 'y',
      description: 'I am sure I want to do this - do not prompt me',
      required: false,
    }),
    revokeInApple: Flags.boolean({
      char: 'a',
      description: 'Also revoke the Certificate in Apple (cannot be undone)',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AppleCertificateDelete)
    const {immediate, iAmSure, revokeInApple} = flags

    const userCredentials = await getUserCredentials()
    const userCerts = userCredentials.filter(
      (cred) => cred.platform === Platform.IOS && cred.type === CredentialsType.CERTIFICATE && cred.isActive,
    )

    if (userCerts.length === 0) {
      this.error('No iOS Distribution Certificate found which can be deleted.')
    }

    const [cert] = userCerts

    let appleCert = null
    let authState = null
    let ctx = null

    if (revokeInApple) {
      authState = await this.refreshAppleAuthState()
      ctx = authState.context
      // Check the cert exists in Apple if we are going to revoke it
      const query: Record<string, any> = {
        certificateType: CertificateType.DISTRIBUTION,
        serialNumber: cert.serialNumber
      }
      // ConnectQueryParams<Partial<{ certificateType: CertificateType | CertificateType[]; displayName: string | string[]; serialNumber: string | string[]; } & { id?: string | undefined; }>>
      // TODO: this is the wrong way to find the cert
      appleCert = await Certificate.infoAsync(ctx, { id: '', query })
      if (!appleCert?.id) {
        this.error('The iOS Distribution Certificate was not found in Apple, so cannot be revoked there.')
      }
    }

    const getAreYouSure = async (): Promise<boolean> => {
      if (iAmSure) return true
      const confirmString = getShortUUID(cert.id)
      const prompt = getRenderedMarkdown({
        filename: 'confirm-delete-apple-credential.md.ejs',
        templateVars: {
          confirmString,
          credentialType: 'iOS Distribution Certificate',
          exportCommand: `shipthis apple certificate export cert.zip`,
          immediate,
          revokeInApple,
        },
      })
      this.log(prompt)
      const input = await getInput('')
      return input.trim().toLowerCase() === confirmString.toLowerCase()
    }

    const areYouSure = await getAreYouSure()
    if (!areYouSure) {
      this.log('Aborting - not deleting the iOS Distribution Certificate')
      this.exit(0)
    }

    await deleteUserCredential({
      credentialId: cert.id,
      isImmediate: immediate,
    })

    this.log('The iOS Distribution Certificate has been deleted from ShipThis.')

    if (revokeInApple) {
      Certificate.deleteAsync(ctx, {id: cert.serialNumber})
      this.log('The iOS Distribution Certificate has been revoked in Apple.')
    }

    await this.config.runCommand(`apple:certificate:status`, [!revokeInApple ? '--noAppleAuth' : ''].filter(Boolean))
  }
}
