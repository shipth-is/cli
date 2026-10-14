import {Flags} from '@oclif/core'
import {Box, Text, render} from 'ink'

import {getProjects} from '@cli/api/index.js'
import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {Command, Table} from '@cli/components/index.js'
import {WIZARD_COMMANDS} from '@cli/constants/commands.js'
import {ProjectListParams} from '@cli/types'
import {getShortDate} from '@cli/utils/dates.js'
import {getShortUUID} from '@cli/utils/index.js'

// Not specific to one game so we use BaseAuthenticatedCommand
export default class GameList extends BaseAuthenticatedCommand<typeof GameList> {
  static override args = {}

  static override description = 'Shows a list of your games. Use --archived or --all to include archived games.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --archived',
    '<%= config.bin %> <%= command.id %> --all',
  ]

  static override flags = {
    all: Flags.boolean({description: 'Show archived and active games', exclusive: ['archived']}),
    archived: Flags.boolean({description: 'Show only archived games', exclusive: ['all']}),
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
    // Only these go to the API - a new flag must not become a query param by accident
    const params: ProjectListParams = {
      archived: flags.all ? 'all' : flags.archived ? 'true' : 'false',
      order: flags.order as ProjectListParams['order'],
      orderBy: flags.orderBy as ProjectListParams['orderBy'],
      pageNumber: flags.pageNumber,
      pageSize: flags.pageSize,
    }
    const showArchived = params.archived !== 'false'
    const gameListResponse = await getProjects(params)

    const data = gameListResponse.data.map((game) => {
      const item: Record<string, string> = {}
      item.id = getShortUUID(game.id)
      item.name = game.name
      item.createdAt = getShortDate(game.createdAt)
      if (showArchived) item.archivedAt = game.archivedAt ? getShortDate(game.archivedAt) : ''
      return item
    })

    render(
      <Command command={this}>
        {data.length === 0 && params.pageNumber === 0 && flags.archived && <Text>No archived games found.</Text>}
        {data.length === 0 && params.pageNumber === 0 && !flags.archived && (
          <Box flexDirection="column">
            <Text>No games found. Create one now with:</Text>
            <Box flexDirection="column" marginLeft={2} marginTop={1}>
              {WIZARD_COMMANDS.map((command) => (
                <Text key={command}>{command}</Text>
              ))}
            </Box>
            {!flags.all && (
              <Box marginTop={1}>
                <Text>Use the --archived flag to see archived games.</Text>
              </Box>
            )}
          </Box>
        )}
        {data.length > 0 && <Table data={data} />}
        {gameListResponse.pageCount > 1 && (
          <Box flexDirection="column" marginTop={1}>
            <Text>{`Showing page ${flags.pageNumber + 1} of ${gameListResponse.pageCount}.`}</Text>
            <Text>Use the --pageNumber flag to see other pages.</Text>
          </Box>
        )}
      </Command>,
    )
  }
}
