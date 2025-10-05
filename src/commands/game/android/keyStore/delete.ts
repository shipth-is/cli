import {Flags} from '@oclif/core'

import {CredentialsType, Platform} from '@cli/types'
import {deleteProjectCredential, getProjectCredentials} from '@cli/api/index.js'
import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {getRenderedMarkdown} from '@cli/components/index.js'
import {getShortUUID, getInput} from '@cli/utils/index.js'

export default class GameAndroidKeyStoreDelete extends BaseGameAndroidCommand<typeof GameAndroidKeyStoreDelete> {
  static override args = {}
  static override description = 'Delete the active Android KeyStore from ShipThis'
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --immediate --iAmSure',
  ]
  static override flags = {
    ...BaseGameAndroidCommand.flags,
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
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(GameAndroidKeyStoreDelete)
    const {immediate, iAmSure} = flags

    const game = await this.getGame()

    const projectCredentials = await getProjectCredentials(game.id)
    const userAndroidKeystoreCredentials = projectCredentials.filter(
      (cred) => cred.platform === Platform.ANDROID && cred.type === CredentialsType.CERTIFICATE && cred.isActive,
    )

    if (userAndroidKeystoreCredentials.length === 0) {
      this.log('No active Android keystore credentials found.')
      return
    }

    const [keyStore] = userAndroidKeystoreCredentials

    const getAreYouSure = async (): Promise<boolean> => {
      if (iAmSure) return true
      const confirmString = getShortUUID(keyStore.id)
      const prompt = getRenderedMarkdown({
        filename: 'confirm-delete-android-keystore.md.ejs',
        templateVars: {
          confirmString,
          exportCommand: `shipthis game android keyStore export keyStore.zip`,
          immediate,
        },
      })
      this.log(prompt)
      const input = await getInput('')
      return input.trim().toLowerCase() === confirmString.toLowerCase()
    }

    const areYouSure = await getAreYouSure()
    if (!areYouSure) {
      this.log('Aborting - Android KeyStore not deleted')
      this.exit(0)
    }

    await deleteProjectCredential(game.id, {
      credentialId: keyStore.id,
      isImmediate: immediate,
    })

    this.log('The Android KeyStore has been deleted from ShipThis.')
  }
}
