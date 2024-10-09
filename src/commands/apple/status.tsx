import {BaseAppleCommand} from '@cli/baseCommands/index.js'
import {App, NextSteps, StatusTable} from '@cli/components/index.js'
import {render} from 'ink'

// TODO: allow to run if not authed so we can see if we are not authed?
export default class AppleStatus extends BaseAppleCommand<typeof AppleStatus> {
  static override args = {}

  static override description = 'Shows the status of the Apple authentication and integration'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const authState = await this.refreshAppleAuthState()
    const {session} = authState

    const statuses = {
      'Full Name': session.user.fullName,
      'Provider Name': session.provider.name,
    }

    // TODO: steps
    const steps: string[] = []

    // TODO: this looks ugly as shit
    render(
      <App>
        <StatusTable marginBottom={1} title="Apple Status" statuses={statuses as any} />
        <NextSteps steps={steps} />
      </App>,
    )
  }
}
