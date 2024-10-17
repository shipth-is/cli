import {render} from 'ink'
import {Flags} from '@oclif/core'

import {BaseGameCommand} from '@cli/baseCommands/index.js'

import {PageAndSortParams} from '@cli/types.js'

import {App, BuildsTable} from '@cli/components/index.js'

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
    pageNumber: Flags.integer({char: 'p', description: 'The page number to show (starts at 0)', default: 0}),
    pageSize: Flags.integer({char: 's', description: 'The number of items to show per page', default: 10}),
    orderBy: Flags.string({
      char: 'o',
      description: 'The field to order by',
      default: 'createdAt',
      options: ['createdAt', 'updatedAt'],
    }),
    order: Flags.string({
      char: 'r',
      description: 'The order to sort by',
      default: 'desc',
      options: ['asc', 'desc'],
    }),
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
      <App>
        <BuildsTable queryProps={queryProps} />
      </App>,
    )
  }
}
