import {Flags} from '@oclif/core'
import {render} from 'ink'
import {v4 as uuid} from 'uuid'

import {createAPIKey} from '@cli/api/index.js'
import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {Command, RunWithSpinner, getRenderedMarkdown} from '@cli/components/index.js'
import {getShortDate} from '@cli/utils/dates.js'
import {getShortUUID} from '@cli/utils/index.js'

export default class ApiKeyCreate extends BaseAuthenticatedCommand<typeof ApiKeyCreate> {
  static override args = {}
  static override description = 'Create a new API key for your ShipThis account.'
  static override examples = [
    '<%= config.bin %> <%= command.id %> --durationDays 30',
    '<%= config.bin %> <%= command.id %> --name ci-key --durationDays 90',
    '<%= config.bin %> <%= command.id %> --name ci-key-headless --durationDays 365 --quiet',
  ]

  static override flags = {
    durationDays: Flags.integer({
      char: 'd',
      default: 365,
      description: 'duration of the API key in days',
    }),
    name: Flags.string({
      char: 'n',
      description: 'name to apply to the API key (if not provided, a random name will be generated)',
    }),
    quiet: Flags.boolean({
      char: 'q',
      default: false,
      description: 'Outputs just the secret value',
    }),
  }

  public async run(): Promise<void> {
    const {durationDays, name} = this.flags

    const createKey = async () => {
      // Name is optional, if not provided, a random name will be generated
      const apiKeyName = name ? (name as string) : `api-key-${getShortUUID(uuid())}`
      const apiKeyWithSecret = await createAPIKey({durationDays, name: apiKeyName})

      const successMessage = getRenderedMarkdown({
        filename: 'apikey-create.md',
        templateVars: {
          keyExpiry: getShortDate(apiKeyWithSecret.expiresAt),
          keyId: getShortUUID(apiKeyWithSecret.id),
          keyName: apiKeyWithSecret.name,
          keySecret: apiKeyWithSecret.secret,
        },
      })

      if (this.flags.quiet) {
        this.log(apiKeyWithSecret.secret)
        return
      }

      this.log(successMessage)
    }

    if (this.flags.quiet) return await createKey()

    render(
      <Command command={this}>
        <RunWithSpinner
          executeMethod={createKey}
          msgInProgress="Creating ShipThis API key..."
          onComplete={() => process.exit(0)}
        />
      </Command>,
    )
  }
}
