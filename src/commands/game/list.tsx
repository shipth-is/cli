import {Flags} from '@oclif/core'
import {Box, Text, render} from 'ink'

import {getProjects} from '@cli/api/index.js'
import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {Command, Table} from '@cli/components/index.js'
import {PageAndSortParams} from '@cli/types'
import {getShortDate} from '@cli/utils/dates.js'
import {getShortUUID} from '@cli/utils/index.js'

// Not specific to one game so we use BaseAuthenticatedCommand
export default class GameList extends BaseAuthenticatedCommand<typeof GameList> {
  static override args = {}

  static override description = 'Shows a list of all your games.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
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
      options: ['createdAt', 'updatedAt', 'name'],
    }),
    pageNumber: Flags.integer({char: 'p', default: 0, description: 'The page number to show (starts at 0)'}),
    pageSize: Flags.integer({char: 's', default: 10, description: 'The number of items to show per page'}),
  }

  public async run(): Promise<void> {
    const {flags} = this
    const params = flags as PageAndSortParams
    const gameListResponse = await getProjects(params)

    const data = gameListResponse.data.map((game) => {
      const item: Record<string, string> = {}
      item.id = getShortUUID(game.id)
      item.name = game.name
      item.createdAt = getShortDate(game.createdAt)
      return item
    })

    render(
      <Command command={this}>
        {data.length === 0 && params.pageNumber === 0 && (
          <Box flexDirection="column">
            <Text>No games found. Create one now with:</Text>
            <Box flexDirection="column" marginLeft={2} marginTop={1}>
              <Text>shipthis game wizard android</Text>
              <Text>shipthis game wizard ios</Text>
            </Box>
          </Box>
        )}
        {data.length > 0 && <Table data={data} />}
        {gameListResponse.pageCount > 1 && (
          <Box flexDirection="column" marginTop={1}>
            <Text>{`Showing page ${flags.pageNumber + 1} of ${gameListResponse.pageCount}.`}</Text>
            <Text>Use the --pageNumber parameter to see other pages.</Text>
          </Box>
        )}
      </Command>,
    )
  }
}
