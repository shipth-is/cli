import {Flags} from '@oclif/core'
import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {getGoogleAuthUrl} from '@cli/api/index.js'

import qrcode from 'qrcode-terminal'

import open from 'open'

export default class GameAndroidApiKeyConnect extends BaseGameAndroidCommand<typeof GameAndroidApiKeyConnect> {
  static override args = {}

  static override description = 'describe the command here'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const qrCodeLink = await getGoogleAuthUrl(game.id)
    qrcode.generate(qrCodeLink, {small: true})
    // TODO: ask user to press space to open link in the browser
    // We will make a new link, because they may visit both? (they are single use)
  }
}
