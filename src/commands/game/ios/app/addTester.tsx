import {Flags} from '@oclif/core'
import {render} from 'ink'

import {BetaGroup} from '@cli/apple/expo.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {Command, RunWithSpinner} from '@cli/components/index.js'
import {getInput, queryAppleApp} from '@cli/utils/index.js'

const TEST_GROUP_NAME = 'ShipThis Test Group'

export default class GameIosAppAddTester extends BaseGameCommand<typeof GameIosAppAddTester> {
  static override args = {}

  static override description = 'Adds a test user to the game in App Store Connect.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    email: Flags.string({char: 'e', description: 'The email address of the tester'}),
    firstName: Flags.string({char: 'f', description: 'The first name of the tester'}),
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    lastName: Flags.string({char: 'l', description: 'The last name of the tester'}),
    self: Flags.boolean({
      char: 's',
      description: 'Add yourself as a tester (uses your Apple ID email and name)',
      default: false,
    }),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const authState = await this.refreshAppleAuthState()
    const ctx = authState.context

    const {flags} = this

    const getEmail = async (): Promise<string> => {
      if (flags.self) return authState.session.user.emailAddress
      if (flags.email) return flags.email
      const question = `Please enter the email address of the tester: `
      const enteredEmail = await getInput(question)
      if (!enteredEmail) this.error('No email address provided')
      return enteredEmail
    }

    const getFirstName = async (): Promise<string> => {
      if (flags.self) return authState.session.user.firstName
      if (flags.firstName) return flags.firstName
      const suggestedName = 'John'
      const question = `Please enter the first name of the tester, or press enter to use ${suggestedName}: `
      const enteredName = await getInput(question)
      return enteredName || suggestedName
    }

    const getLastName = async (): Promise<string> => {
      if (flags.self) return authState.session.user.lastName
      if (flags.lastName) return flags.lastName
      const suggestedName = 'Doe'
      const question = `Please enter the last name of the tester, or press enter to use ${suggestedName}: `
      const enteredName = await getInput(question)
      return enteredName || suggestedName
    }

    const email = await getEmail()
    const firstName = await getFirstName()
    const lastName = await getLastName()

    const addTestUser = async () => {
      const {app} = await queryAppleApp({ctx, iosBundleId: game.details?.iosBundleId})
      if (!app) return this.error('No app found')

      const groups = await BetaGroup.getAsync(ctx, {})

      let shipThisGroup = groups.find(
        (group) => group.attributes.name === TEST_GROUP_NAME && group.attributes.isInternalGroup,
      )
      if (!shipThisGroup) {
        shipThisGroup = await BetaGroup.createAsync(ctx, {
          id: app.id,
          isInternalGroup: true,
          name: TEST_GROUP_NAME,
          hasAccessToAllBuilds: true,
        })
      }

      await shipThisGroup.createBulkBetaTesterAssignmentsAsync([
        {
          email,
          firstName,
          lastName,
        },
      ])
    }

    const handleComplete = async () => {}

    render(
      <Command command={this}>
        <RunWithSpinner
          executeMethod={addTestUser}
          msgComplete="Added test user"
          msgInProgress="Adding test user..."
          onComplete={handleComplete}
        />
      </Command>,
    )
  }
}
