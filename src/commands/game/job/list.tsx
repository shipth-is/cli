import {render, Box, Text} from 'ink'
import {Flags} from '@oclif/core'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProjectJobs} from '@cli/api/index.js'
import {PageAndSortParams} from '@cli/types.js'

import {Container, Table} from '@cli/components/index.js'
import {getShortUUID} from '@cli/utils/index.js'
import {getShortDate} from '@cli/utils/dates.js'

export default class GameJobList extends BaseGameCommand<typeof GameJobList> {
  static override args = {}

  static override description =
    'Lists the jobs for a game. If --gameId is not provided it will look in the current directory.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
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

    const jobListResponse = await getProjectJobs(game.id, params)

    const data = jobListResponse.data.map((job) => {
      return {
        id: getShortUUID(job.id),
        type: job.type,
        status: job.status,
        createdAt: getShortDate(job.createdAt),
      }
    })

    render(
      <Container>
        <Table data={data} />
        {jobListResponse.pageCount > 1 && (
          <Box marginTop={1} flexDirection="column">
            <Text>{`Showing page ${flags.pageNumber + 1} of ${jobListResponse.pageCount}.`}</Text>
            <Text>Use the --pageNumber parameter to see other pages.</Text>
          </Box>
        )}
      </Container>,
    )
  }
}
