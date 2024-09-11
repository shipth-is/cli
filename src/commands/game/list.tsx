import {render, Box, Text} from 'ink'
import {Flags} from '@oclif/core'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {PageAndSortParams} from '@cli/types.js'
import {getProjects} from '@cli/api/index.js'

import {Container, Table} from '@cli/components/index.js'
import {getShortUUID} from '@cli/utils/index.js'
import {getShortDate} from '@cli/utils/dates.js'

// Does not need a project config to be run - so it extends BaseAuthenticatedCommand
export default class GameList extends BaseAuthenticatedCommand<typeof GameList> {
  static override args = {}

  static override description = 'Shows a list of all your games'

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
      <Container>
        <Table data={data} />
        {gameListResponse.pageCount > 1 && (
          <Box marginTop={1} flexDirection="column">
            <Text>{`Showing page ${flags.pageNumber + 1} of ${gameListResponse.pageCount}.`}</Text>
            <Text>Use the --pageNumber parameter to see other pages.</Text>
          </Box>
        )}
      </Container>,
    )
  }
}
