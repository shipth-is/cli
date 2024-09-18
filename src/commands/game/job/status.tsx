import {Args, Flags} from '@oclif/core'
import {render} from 'ink'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {App, JobLogTail, JobStatusTable, NextSteps} from '@cli/components/index.js'
import {Job, JobStatus} from '@cli/types.js'
import {getJob} from '@cli/api/index.js'

export default class GameJobStatus extends BaseGameCommand<typeof GameJobStatus> {
  static override args = {
    job_id: Args.string({description: 'The id of the job to get the status of', required: true}),
  }

  static override description = 'Shows the real-time status of a job.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> 4d32239e',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4 4d32239e',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4 --lines 20 --follow 4d32239e',
  ]

  static override flags = {
    ...super.flags,
    lines: Flags.integer({char: 'n', description: 'The number of lines to show', default: 10}),
    follow: Flags.boolean({char: 'f', description: 'Follow the log in real-time', default: false}),
  }

  protected async getJob(): Promise<Job> {
    try {
      const game = await this.getGame()
      const job = await getJob(this.args.job_id, game.id)
      return job
    } catch (e: any) {
      if (e?.response?.status === 404) {
        this.error('Job not found - please check you have access', {exit: 1})
      }
      throw e
    }
  }

  public async run(): Promise<void> {
    // We run the getJob first to check the user has access
    const job = await this.getJob()

    const {lines, follow} = this.flags

    // If the job is already completed or failed, we can exit early (when watching)
    const handleJobUpdate = (job: Job) => {
      if (follow && [JobStatus.COMPLETED, JobStatus.FAILED].includes(job.status)) {
        setTimeout(() => {
          // Close after 2 seconds to ensure the last log lines are shown
          process.exit(0)
        }, 2000)
      }
    }

    render(
      <App>
        <JobStatusTable jobId={job.id} projectId={job.project.id} isWatching={follow} onJobUpdate={handleJobUpdate} />
        <JobLogTail jobId={job.id} projectId={job.project.id} length={lines} isWatching={follow} />
        <NextSteps steps={[]} />
      </App>,
    )
  }
}
