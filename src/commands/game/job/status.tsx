import {Args} from '@oclif/core'
import {render} from 'ink'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {App, JobLogTail, JobStatusTable, NextSteps} from '@cli/components/index.js'
import {Job} from '@cli/types.js'
import {getJob} from '@cli/api/index.js'

export default class GameJobStatus extends BaseGameCommand<typeof GameJobStatus> {
  static override args = {
    job_id: Args.string({description: 'The id of the job to get the status of', required: true}),
  }

  static override description = 'Shows the real-time status of a job.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> abcd1234',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4 abcd1234',
  ]

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

    render(
      <App>
        <JobStatusTable jobId={job.id} projectId={job.project.id} />
        <JobLogTail jobId={job.id} projectId={job.project.id} />
        <NextSteps steps={[]} />
      </App>,
    )
  }
}
