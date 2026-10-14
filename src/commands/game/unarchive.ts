import {setProjectArchived} from '@cli/api/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getShortUUID} from '@cli/utils/index.js'

export default class GameUnarchive extends BaseGameCommand<typeof GameUnarchive> {
  static override args = {}

  static override description =
    'Unarchives a game. The game is shown in your game list again, and you can ship it.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    ...BaseGameCommand.flags,
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const label = `Game "${getShortUUID(game.id)}" (${game.name})`

    if (!game.archivedAt) {
      this.log(`${label} is not archived.`)
      return
    }

    await setProjectArchived(game.id, false)

    this.log(`${label} is now unarchived. You can ship it again.`)
  }
}
