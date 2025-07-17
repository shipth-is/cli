import {getSingleUseUrl} from '@cli/api/index.js'
import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import open from 'open'

export default class Dashboard extends BaseAuthenticatedCommand<typeof Dashboard> {
  static override args = {}
  static override description = 'Opens the web-browser to your ShipThis dashboard'
  static override examples = ['<%= config.bin %> <%= command.id %>']
  static override flags = {}

  public async run(): Promise<void> {
    const dashboardUrl = await getSingleUseUrl('/dashboard')
    console.log(`Opening ${dashboardUrl}...`)
    await open(dashboardUrl)
    process.exit(0)
  }
}
