import {BaseAppleCommand} from '@cli/baseCommands/baseAppleCommand.js'
import {Container, NextSteps, StatusTable} from '@cli/components/index.js'
import {render} from 'ink'

// TODO: allow to run if not authed so we can see if we are not authed?
export default class AppleStatus extends BaseAppleCommand<typeof AppleStatus> {
  static override args = {}

  static override description = 'Shows the status of the Apple authentication and integration'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const authState = await this.refreshAuthState()
    const {session} = authState

    const statuses = {
      fullName: session.user.fullName,
      email: session.user.emailAddress,
      providerName: session.provider.name,
    }

    // TODO: steps
    const steps: string[] = []

    render(
      <Container>
        <StatusTable marginBottom={1} title="Apple Status" statuses={statuses as any} />

        <NextSteps steps={steps} />
      </Container>,
    )
  }
}
