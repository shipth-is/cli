import {Args} from '@oclif/core'

import {BaseGameCommand} from '@cli/baseCommands/index.js'

export default class GameJobStatus extends BaseGameCommand<typeof GameJobStatus> {
  static override args = {
    jobId: Args.string({description: 'The id of the job to get the status of'}),
  }

  static override description = 'Shows the real-time status of a job.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> abcd1234',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4 abcd1234',
  ]

  public async run(): Promise<void> {
    const {args} = this
  }
}
