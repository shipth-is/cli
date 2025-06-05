import {render, Box, Text} from 'ink'
import {Flags} from '@oclif/core'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProjectJobs} from '@cli/api/index.js'
import {JobStatus, PageAndSortParams} from '@cli/types'

import {Command, Table, Title} from '@cli/components/index.js'
import {getJobStatusColor, getJobSummary} from '@cli/utils/index.js'
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

    const data = jobListResponse.data.map((j) => getJobSummary(j, DateTime.now()))

    const hasJobs = data.length > 0

    render(
      <Command command={this}>
        <Title>Jobs for this game</Title>
        {!hasJobs && (
          <Box marginLeft={2} marginTop={1} flexDirection="column">
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
          <Box marginTop={1} flexDirection="column">
            <Text>{`Showing page ${flags.pageNumber + 1} of ${jobListResponse.pageCount}.`}</Text>
            <Text>Use the --pageNumber parameter to see other pages.</Text>
          </Box>
        )}
      </Command>,
    )
  }
}
