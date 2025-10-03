import {Flags} from '@oclif/core'

import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {CredentialsType, Platform} from '@cli/types'
import {deleteProjectCredential, getProjectCredentials} from '@cli/api/index.js'
import {getRenderedMarkdown} from '@cli/components/index.js'
import {getShortUUID, getInput} from '@cli/utils/index.js'

export default class GameAndroidApiKeyDelete extends BaseGameAndroidCommand<typeof GameAndroidApiKeyDelete> {
  static override args = {}
  static override description = 'Delete the active Android API Key from ShipThis'
  static override examples = ['<%= config.bin %> <%= command.id %>']
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
    const {flags} = await this.parse(GameAndroidApiKeyDelete)
    const {immediate, iAmSure} = flags

    const game = await this.getGame()

    const projectCredentials = await getProjectCredentials(game.id)
    const activeKeys = projectCredentials.filter(
      (cred) => cred.platform === Platform.ANDROID && cred.type === CredentialsType.KEY && cred.isActive,
    )

    if (activeKeys.length === 0) {
      this.log('No active Android API Key found which can be deleted.')
      return
    }

    const [apiKey] = activeKeys

    const getAreYouSure = async (): Promise<boolean> => {
      if (iAmSure) return true
      const confirmString = getShortUUID(apiKey.id)
      const prompt = getRenderedMarkdown({
        filename: 'confirm-delete-android-serviceaccountkey.md.ejs',
        templateVars: {
          confirmString,
          exportCommand: `shipthis game android apiKey export apiKey.json`,
          immediate,
        },
      })
      this.log(prompt)
      const input = await getInput('')
      return input.trim().toLowerCase() === confirmString.toLowerCase()
    }

    const areYouSure = await getAreYouSure()
    if (!areYouSure) {
      this.log('Aborting - Android API Key not deleted')
      this.exit(0)
    }

    await deleteProjectCredential(game.id, {
      credentialId: apiKey.id,
      isImmediate: immediate,
    })

    this.log('The Android API Key has been deleted from ShipThis.')
  }
}
