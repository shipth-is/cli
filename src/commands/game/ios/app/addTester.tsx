import {render} from 'ink'
import {Flags} from '@oclif/core'

import {Command, RunWithSpinner} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {BetaGroup} from '@cli/apple/expo.js'
import {getInput, queryAppleApp} from '@cli/utils/index.js'

const TEST_GROUP_NAME = 'ShipThis Test Group'

export default class GameIosAppAddTester extends BaseGameCommand<typeof GameIosAppAddTester> {
  static override args = {}

  static override description = 'Adds a test user to the game in App Store Connect.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    email: Flags.string({char: 'e', description: 'The email address of the tester'}),
    firstName: Flags.string({char: 'f', description: 'The first name of the tester'}),
    lastName: Flags.string({char: 'l', description: 'The last name of the tester'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const authState = await this.refreshAppleAuthState()
    const ctx = authState.context

    const {flags} = this

    const getEmail = async (): Promise<string> => {
      if (flags.email) return flags.email
      const question = `Please enter the email address of the tester: `
      const enteredEmail = await getInput(question)
      if (!enteredEmail) {
        this.error('No email address provided')
      }
      return enteredEmail
    }

    const getFirstName = async (): Promise<string> => {
      if (flags.firstName) return flags.firstName
      const suggestedName = 'John'
      const question = `Please enter the first name of the tester, or press enter to use ${suggestedName}: `
      const enteredName = await getInput(question)
      return enteredName || suggestedName
    }

    const getLastName = async (): Promise<string> => {
      if (flags.lastName) return flags.lastName
      const suggestedName = 'Doe'
      const question = `Please enter the last name of the tester, or press enter to use ${suggestedName}: `
      const enteredName = await getInput(question)
      return enteredName || suggestedName
    }

    const email = await getEmail()
    const firstName = await getFirstName()
    const lastName = await getLastName()

    console.warn('This command does not yet work. It fails with an assertion error.')

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
          name: TEST_GROUP_NAME,
          isInternalGroup: true,
          publicLinkEnabled: false,
          publicLinkLimit: 1,
          publicLinkLimitEnabled: false,
        })
      }

      // TODO: this should work but fails with:
      // AssertionError [ERR_ASSERTION]: No type class found for "bulkBetaTesterAssignments"
      // We may have to use a different app store connect library or call the API directly?
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
          msgInProgress="Adding test user..."
          msgComplete="Added test user"
          executeMethod={addTestUser}
          onComplete={handleComplete}
        />
      </Command>,
    )
  }
}
