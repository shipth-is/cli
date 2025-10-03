
import {Flags} from '@oclif/core'

import {BaseGameCommand} from '@cli/baseCommands/baseGameCommand.js'
import {CredentialsType, Platform} from '@cli/types'
import {deleteProjectCredential, getProjectCredentials} from '@cli/api/index.js'
import {getRenderedMarkdown} from '@cli/components/index.js'
import {getShortUUID, getInput, queryAppleProfiles} from '@cli/utils/index.js'

export default class GameIosProfileDelete extends BaseGameCommand<typeof GameIosProfileDelete> {
  static override args = {}
  static override description = 'Delete an iOS Mobile Provisioning Profile from ShipThis and optionally from Apple'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {
    ...BaseGameCommand.flags,
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
      description: 'Also revoke the Profile in Apple (cannot be undone)',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(GameIosProfileDelete)
    const {immediate, iAmSure, revokeInApple} = flags

    const game = await this.getGame()

    const projectCredentials = await getProjectCredentials(game.id)
    const userAppleProfileCredentials = projectCredentials.filter(
      (cred) => cred.platform === Platform.IOS && cred.type === CredentialsType.CERTIFICATE && cred.isActive,
    )

    if (userAppleProfileCredentials.length === 0) {
      this.error('No active Mobile Provisioning Profile found which can be deleted.')
    }

    const [profile] = userAppleProfileCredentials

    let appleProfile = null

    if (revokeInApple) {
      const authState = await this.refreshAppleAuthState()
      const ctx = authState.context

      const appleProfiles = await queryAppleProfiles({ ctx });

      appleProfile = appleProfiles.find((p) => {
        const profileSerialNumber = p.attributes.certificates?.[0]?.attributes.serialNumber
        return profileSerialNumber === profile.serialNumber
      });

      if (!appleProfile?.id) {
        this.error('The Mobile Provisioning Profile was not found in Apple, so cannot be revoked there.')
      }
    }

    const getAreYouSure = async (): Promise<boolean> => {
      if (iAmSure) return true
      const confirmString = getShortUUID(profile.id)
      const prompt = getRenderedMarkdown({
        filename: 'confirm-delete-apple-credential.md.ejs',
        templateVars: {
          confirmString,
          credentialType: 'Mobile Provisioning Profile',
          exportCommand: `shipthis game ios profile export userProfile.zip`,
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
      this.log('Aborting - Mobile Provisioning Profile not deleted')
      this.exit(0)
    }

    await deleteProjectCredential(game.id, {
      credentialId: profile.id,
      isImmediate: immediate,
    })

    this.log('The Mobile Provisioning Profile has been deleted from ShipThis.')

    if (revokeInApple && appleProfile?.id) {
      await appleProfile.deleteAsync()
      this.log('The Mobile Provisioning Profile has been deleted in Apple.')
    }
  }
}
