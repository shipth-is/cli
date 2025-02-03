import qrcode from 'qrcode-terminal'
import open from 'open'
import {Flags} from '@oclif/core'

import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {getGoogleAuthUrl, getGoogleStatus, getShortAuthRequiredUrl} from '@cli/api/index.js'

export default class GameAndroidApiKeyConnect extends BaseGameAndroidCommand<typeof GameAndroidApiKeyConnect> {
  static override args = {}

  static override description =
    'Connects ShipThis with Google for managing Service Account API Keys for an Android game'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    desktop: Flags.boolean({char: 'd', description: 'Open the link in the desktop browser'}),
    mobile: Flags.boolean({char: 'm', description: 'Display a QR code for mobile authentication'}),
    helpPage: Flags.boolean({
      char: 'h',
      description: 'Open the interstitial help page first rather than the Google OAuth page',
    }),
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const {desktop, mobile, helpPage, force} = this.flags

    const googleStatus = await getGoogleStatus()

    if (googleStatus.isAuthenticated && !force) {
      throw new Error('You are already authenticated with Google. Use --force to re-authenticate.')
    }

    // TODO: will this change?
    const helpPagePath = `/docs/android?gameId=${game.id}#2-connect-shipthis-with-google`
    const url = helpPage ? await getShortAuthRequiredUrl(helpPagePath) : await getGoogleAuthUrl(game.id)

    if (desktop) {
      await open(url)
      return
    }
    if (mobile) {
      qrcode.generate(url, {small: true})
      return
    }

    console.log('Scan the QR code below to connect ShipThis with Google (you will be asked to enter an OTP):')
    qrcode.generate(url, {small: true})
    console.log('Press any key to open the link in your browser...')
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.once('data', async () => {
      process.stdin.setRawMode(false)
      process.stdin.pause()
      await open(url)
    })
  }
}
