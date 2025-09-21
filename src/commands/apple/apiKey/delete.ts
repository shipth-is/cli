import {Flags} from '@oclif/core'

import {BaseAppleCommand} from '@cli/baseCommands/index.js'
import {deleteUserCredential, getUserCredentials} from '@cli/api/index.js'
import {getRenderedMarkdown} from '@cli/components/common/index.js'

import {ApiKey} from '@cli/apple/expo.js'
import {CredentialsType, Platform} from '@cli/types'
import {getInput, getShortUUID} from '@cli/utils/index.js'

export default class AppleApiKeyDelete extends BaseAppleCommand<typeof AppleApiKeyDelete> {
  static override args = {}
  static override description = 'Delete an Apple API Key from ShipThis and optionally from Apple'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --immediate --revokeInApple --iAmSure',
  ]
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
      description: 'Also revoke the API Key in Apple (cannot be undone)',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AppleApiKeyDelete)
    const {immediate, iAmSure, revokeInApple} = flags

    const userCredentials = await getUserCredentials()
    const userAppleApiKeyCredentials = userCredentials.filter(
      (cred) => cred.platform === Platform.IOS && cred.type === CredentialsType.KEY && cred.isActive,
    )

    if (userAppleApiKeyCredentials.length === 0) {
      this.error('No App Store Connect API Key found which can be deleted.')
    }

    const [key] = userAppleApiKeyCredentials

    let appleKey = null

    if (revokeInApple) {
      const authState = await this.refreshAppleAuthState()
      const ctx = authState.context
      // Check the key exists in Apple if we are going to revoke it
      appleKey = await ApiKey.infoAsync(ctx, {id: key.serialNumber})
      if (!appleKey?.id) {
        this.error('The App Store Connect API Key was not found in Apple, so cannot be revoked there.')
      }
    }

    const getAreYouSure = async (): Promise<boolean> => {
      if (iAmSure) return true
      const confirmString = getShortUUID(key.id)
      const prompt = getRenderedMarkdown({
        filename: 'confirm-delete-credential.md.ejs',
        templateVars: {
          confirmString,
          credentialType: 'App Store Connect API Key',
          exportCommand: `shipthis apple apiKey export appleApiKey.zip`,
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
      this.log('Aborting - not deleting the API Key')
      this.exit(0)
    }

    await deleteUserCredential({
      credentialId: key.id,
      isImmediate: immediate,
    })

    this.log('The API Key has been deleted from ShipThis.')

    if (revokeInApple && appleKey?.id) {
      await appleKey.revokeAsync()
      this.log('The API Key has been revoked in Apple.')
    }

    await this.config.runCommand(`apple:apiKey:status`, [!revokeInApple ? '--noAppleAuth' : ''].filter(Boolean))
  }
}
