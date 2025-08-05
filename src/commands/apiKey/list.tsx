import {Flags} from '@oclif/core'
import {Box, Text, render} from 'ink'

import {getAPIKeys} from '@cli/api/index.js'
import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {Command, Table} from '@cli/components/index.js'
import {PageAndSortParams} from '@cli/types/request.js'
import {getShortDate} from '@cli/utils/dates.js'
import {getShortUUID} from '@cli/utils/index.js'

export default class ApiKeyList extends BaseAuthenticatedCommand<typeof ApiKeyList> {
  static override args = {}

  static override description = 'Displays a list of your ShipThis API keys.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --pageNumber 1',
    '<%= config.bin %> <%= command.id %> --orderBy createdAt --order asc',
  ]

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

    const apiKeysListResponse = await getAPIKeys(params)

    const data = apiKeysListResponse.data.map((apiKey) => ({
      expiresAt: getShortDate(apiKey.expiresAt),
      id: getShortUUID(apiKey.id),
      lastUsedAt: apiKey.lastUsedAt ? getShortDate(apiKey.lastUsedAt) : 'Never',
      name: apiKey.name,
      revokedAt: apiKey.revokedAt ? getShortDate(apiKey.revokedAt) : 'Active',
    }))

    const emptyState = (
      <Box flexDirection="column">
        <Text>No API keys found. Create one now with:</Text>
        <Box flexDirection="column" marginLeft={2} marginTop={1}>
          <Text>shipthis apiKey create</Text>
        </Box>
      </Box>
    )

    render(
      <Command command={this}>
        {data.length === 0 && params.pageNumber === 0 && emptyState}
        {data.length > 0 && <Table data={data} />}
        {apiKeysListResponse.pageCount > 1 && (
          <Box flexDirection="column" marginTop={1}>
            <Text>{`Showing page ${flags.pageNumber + 1} of ${apiKeysListResponse.pageCount}.`}</Text>
            <Text>Use the --pageNumber parameter to see other pages.</Text>
          </Box>
        )}
      </Command>,
    )
  }
}
