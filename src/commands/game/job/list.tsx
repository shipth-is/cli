import {getProjectJobs} from '@cli/api/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {Command, Table, Title} from '@cli/components/index.js'
import {JobStatus, PageAndSortParams} from '@cli/types'
import {getJobStatusColor, getJobSummary} from '@cli/utils/index.js'
import {Flags} from '@oclif/core'
import {Box, Text, render} from 'ink'
import {DateTime} from 'luxon'

export default class GameJobList extends BaseGameCommand<typeof GameJobList> {
  static override args = {}

  static override description = 'Lists the jobs for a game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
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

    const jobListResponse = await getProjectJobs(game.id, params)

    const data = jobListResponse.data.map((j) => getJobSummary(j, DateTime.now()))

    const hasJobs = data.length > 0

    render(
      <Command command={this}>
        <Title>Jobs for this game</Title>
        {!hasJobs && (
          <Box flexDirection="column" marginLeft={2} marginTop={1}>
            <Text>You DO NOT have any jobs for this game.</Text>
          </Box>
        )}
        {hasJobs && (
          <Table
            data={data}
            getTextProps={(col, val) => {
              if (col.key !== 'status') return {}
              return {color: getJobStatusColor(val as JobStatus)}
            }}
          />
        )}
        {jobListResponse.pageCount > 1 && (
          <Box flexDirection="column" marginTop={1}>
            <Text>{`Showing page ${flags.pageNumber + 1} of ${jobListResponse.pageCount}.`}</Text>
            <Text>Use the --pageNumber parameter to see other pages.</Text>
          </Box>
        )}
      </Command>,
    )
  }
}
