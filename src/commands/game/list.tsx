import {render, Box, Text} from 'ink'
import {Flags} from '@oclif/core'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {PageAndSortParams} from '@cli/types'
import {getProjects} from '@cli/api/index.js'

import {Command, Table} from '@cli/components/index.js'
import {getShortUUID} from '@cli/utils/index.js'
import {getShortDate} from '@cli/utils/dates.js'

// Not specific to one game so we use BaseAuthenticatedCommand
export default class GameList extends BaseAuthenticatedCommand<typeof GameList> {
  static override args = {}

  static override description = 'Shows a list of all your games.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    pageNumber: Flags.integer({char: 'p', description: 'The page number to show (starts at 0)', default: 0}),
    pageSize: Flags.integer({char: 's', description: 'The number of items to show per page', default: 10}),
    orderBy: Flags.string({
      char: 'o',
      description: 'The field to order by',
      default: 'createdAt',
      options: ['createdAt', 'updatedAt', 'name'],
    }),
    order: Flags.string({
      char: 'r',
      description: 'The order to sort by',
      default: 'desc',
      options: ['asc', 'desc'],
    }),
  }

  public async run(): Promise<void> {
    const {flags} = this
    const params = flags as PageAndSortParams
    const gameListResponse = await getProjects(params)

    const data = gameListResponse.data.map((game) => {
      return {
        id: getShortUUID(game.id),
        name: game.name,
        createdAt: getShortDate(game.createdAt),
      }
    })

    render(
      <Command command={this}>
        {data.length === 0 && params.pageNumber == 0 && (
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
          <Box marginTop={1} flexDirection="column">
            <Text>{`Showing page ${flags.pageNumber + 1} of ${gameListResponse.pageCount}.`}</Text>
            <Text>Use the --pageNumber parameter to see other pages.</Text>
          </Box>
        )}
      </Command>,
    )
  }
}
