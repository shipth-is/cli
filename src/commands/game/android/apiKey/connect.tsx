import {Flags} from '@oclif/core'
import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {getGoogleAuthUrl, getShortAuthRequiredUrl, getSingleUseUrl} from '@cli/api/index.js'

import qrcode from 'qrcode-terminal'

import open from 'open'

export default class GameAndroidApiKeyConnect extends BaseGameAndroidCommand<typeof GameAndroidApiKeyConnect> {
  static override args = {}

  static override description = 'describe the command here'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    desktop: Flags.boolean({char: 'd', description: 'Open the link in the desktop browser'}),
    helpPage: Flags.boolean({
      char: 'h',
      description: 'Open the interstitial help page first rather than the Google OAuth page',
    }),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const {desktop, helpPage} = this.flags
    // TODO: will this change?
    const helpPagePath = `/docs/android?gameId=${game.id}#2-connect-shipthis-with-google`
    //const url = helpPage ? await getSingleUseUrl(helpPagePath) : await getGoogleAuthUrl(game.id)

    const url = await getShortAuthRequiredUrl(helpPagePath)

    if (desktop) {
      await open(url)
    } else {
      qrcode.generate(url, {small: true})
      // TODO: ask user to press space to open link in the browser
      // We will make a new link, because they may visit both? (they are single use)
    }
  }
}
