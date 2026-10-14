import {setProjectArchived} from '@cli/api/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getShortUUID} from '@cli/utils/index.js'

export default class GameArchive extends BaseGameCommand<typeof GameArchive> {
  static override args = {}

  static override description =
    'Archives a game. An archived game is not shown in your game list, and you cannot ship it.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    ...BaseGameCommand.flags,
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const shortId = getShortUUID(game.id)
    const label = `Game "${shortId}" (${game.name})`

    if (game.archivedAt) {
      this.log(`${label} is already archived.`)
      return
    }

    // No prompt - unarchive undoes this
    await setProjectArchived(game.id, true)

    this.log(`${label} is now archived. It is not shown in your game list.`)
    this.log(`Please run \`shipthis game unarchive --gameId ${shortId}\` to unarchive it.`)
  }
}
