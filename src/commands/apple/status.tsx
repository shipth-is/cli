import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {Command, NextSteps, StatusTable} from '@cli/components/index.js'
import {render} from 'ink'

export default class AppleStatus extends BaseAuthenticatedCommand<typeof AppleStatus> {
  static override args = {}

  static override description = 'Shows the status of the Apple authentication and integration.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const checkAuth = async () => {
      try {
        const authState = await this.refreshAppleAuthState()
        const {session} = authState
        return {
          isAuthenticatedOnApple: true,
          session,
        }
      } catch {
        return {
          isAuthenticatedOnApple: false,
          session: null,
        }
      }
    }

    const {isAuthenticatedOnApple, session} = await checkAuth()

    const statuses = {
      'Authenticated on Apple Developer Portal': isAuthenticatedOnApple,
      'Apple Full Name': session?.user?.fullName || 'Please authenticate',
      'Apple Provider Name': session?.provider?.name || 'Please authenticate',
    }

    let steps = []

    if (!isAuthenticatedOnApple) steps.push('$ shipthis apple login')

    render(
      <Command command={this}>
        <StatusTable marginBottom={1} title="Apple Status" statuses={statuses as any} />
        <NextSteps steps={steps} />
      </Command>,
    )
  }
}
