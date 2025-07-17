import {getJob} from '@cli/api/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {Command, JobLogTail, JobStatusTable, NextSteps} from '@cli/components/index.js'
import {Job, JobStatus} from '@cli/types'
import {Args, Flags} from '@oclif/core'
import {render} from 'ink'

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
    follow: Flags.boolean({char: 'f', default: false, description: 'Follow the log in real-time'}),
    lines: Flags.integer({char: 'n', default: 10, description: 'The number of lines to show'}),
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
    // We run the getJob first to check the user has access
    const job = await this.getJob()
    const {follow, lines} = this.flags

    const handleJobUpdate = (job: Job) => {
      if (!follow) return
      // Exit 2 seconds after completion to ensure the last log lines are shown
      if ([JobStatus.COMPLETED, JobStatus.FAILED].includes(job.status)) {
        const exitCode = job.status == JobStatus.FAILED ? 1 : 0
        setTimeout(() => process.exit(exitCode), 5000)
      }
    }

    render(
      <Command command={this}>
        <JobStatusTable isWatching={follow} jobId={job.id} onJobUpdate={handleJobUpdate} projectId={job.project.id} />
        <JobLogTail isWatching={follow} jobId={job.id} length={lines} projectId={job.project.id} />
        <NextSteps steps={[]} />
      </Command>,
    )
  }
}
