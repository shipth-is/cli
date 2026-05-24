import {Args} from '@oclif/core'

import {getJob, getJobLogsDownloadStream} from '@cli/api/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {Job} from '@cli/types'

export default class GameJobLogs extends BaseGameCommand<typeof GameJobLogs> {
  static override args = {
    job_id: Args.string({description: 'The id of the job to get the logs for', required: true}),
  }

  static override description = 'Downloads the full plain-text logs for a job and writes them to stdout.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> 4d32239e',
    '<%= config.bin %> <%= command.id %> 4d32239e > job.log',
    '<%= config.bin %> <%= command.id %> 4d32239e | grep -i error',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4 4d32239e | less',
  ]

  static override flags = {
    ...super.flags,
  }

  protected async getJob(): Promise<Job> {
    try {
      const game = await this.getGame()
      const job = await getJob(this.args.job_id, game.id)
      return job
    } catch (error: any) {
      if (error?.response?.status === 404) {
        this.error('Job not found - please check you have access', {exit: 1})
      }

      throw error
    }
  }

  public async run(): Promise<void> {
    const job = await this.getJob()

    // Exit cleanly if stdout closes mid-stream (e.g. piped to `head`).
    const handleStdoutError = (err: NodeJS.ErrnoException) => {
      if (err.code === 'EPIPE') process.exit(0)
    }

    process.stdout.on('error', handleStdoutError)

    try {
      const stream = await getJobLogsDownloadStream(job.id, job.project.id)

      for await (const chunk of stream as AsyncIterable<Buffer>) {
        // write() returns false when stdout's buffer is full; wait for 'drain' before resuming.
        if (!process.stdout.write(chunk)) {
          await new Promise<void>((resolve) => process.stdout.once('drain', resolve))
        }
      }
    } finally {
      process.stdout.removeListener('error', handleStdoutError)
    }
  }
}
