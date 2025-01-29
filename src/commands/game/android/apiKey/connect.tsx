import {Flags} from '@oclif/core'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getGoogleAuthUrl} from '@cli/api/index.js'

import open from 'open'

export default class GameAndroidApiKeyConnect extends BaseGameCommand<typeof GameAndroidApiKeyConnect> {
  static override args = {}

  static override description = 'describe the command here'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()

    const authUrl = await getGoogleAuthUrl(game.id)
    await open(authUrl)
  }
}
