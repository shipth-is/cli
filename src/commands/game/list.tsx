import {render, Box, Text} from 'ink'
import {Flags} from '@oclif/core'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {PageAndSortParams} from '@cli/types.js'
import {getProjects} from '@cli/api/index.js'

import {Container} from '@cli/components/Container.js'
import Table from '@cli/components/Table.js'
import {DateTime} from 'luxon'

// Does not need a project config to be run - so it extends BaseAuthenticatedCommand
export default class GameList extends BaseAuthenticatedCommand<typeof GameList> {
  static override args = {}

  static override description = 'Shows a list of all your games'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    pageNumber: Flags.integer({char: 'p', description: 'The page number to show', default: 0}),
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
        name: game.name,
        createdAt: game.createdAt.toLocaleString(DateTime.DATETIME_MED),
      }
    })

    render(
      <Container>
        <Table data={data} />
        <Box marginTop={1}>
          <Text>{`Showing page ${flags.pageNumber + 1} of ${gameListResponse.pageCount} pages`}</Text>
        </Box>
      </Container>,
    )
  }
}
