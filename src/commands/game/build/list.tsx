import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {BuildsTable, CommandGame} from '@cli/components/index.js'
import {PageAndSortParams} from '@cli/types'
import {Flags} from '@oclif/core'
import {render} from 'ink'

export default class GameBuildList extends BaseGameCommand<typeof GameBuildList> {
  static override args = {}

  static override description = 'Lists the builds for successful jobs of a game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4 --pageSize 20 --pageNumber 1',
  ]

  static override flags = {
    ...super.flags,
    order: Flags.string({
      char: 'r',
      default: 'desc',
      description: 'The order to sort by',
      options: ['asc', 'desc'],
    }),
    orderBy: Flags.string({
      char: 'o',
      default: 'createdAt',
      description: 'The field to order by',
      options: ['createdAt', 'updatedAt'],
    }),
    pageNumber: Flags.integer({char: 'p', default: 0, description: 'The page number to show (starts at 0)'}),
    pageSize: Flags.integer({char: 's', default: 10, description: 'The number of items to show per page'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()

    const {flags} = this
    const {gameId, ...otherFlags} = flags
    const params = otherFlags as PageAndSortParams

    const queryProps = {
      projectId: game.id,
      ...params,
    }

    render(
      <CommandGame command={this}>
        <BuildsTable queryProps={queryProps} />
      </CommandGame>,
    )
  }
}
