import {Args, Flags} from '@oclif/core'
import {render} from 'ink'

import {revokeAPIKey} from '@cli/api/index.js'
import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {Command, RunWithSpinner} from '@cli/components/index.js'
import {getShortUUID} from '@cli/utils/index.js'

export default class ApiKeyRevoke extends BaseAuthenticatedCommand<typeof ApiKeyRevoke> {
  static override args = {
    apiKeyId: Args.string({
      description: 'The ID of the API key to revoke',
      required: true,
    }),
  }

  static override description = 'Revokes a specific ShipThis API key.'
  static override examples = [
    '<%= config.bin %> <%= command.id %> abcd1234',
    '<%= config.bin %> <%= command.id %> abcd1234 --quiet',
  ]

  static override flags = {
    quiet: Flags.boolean({
      char: 'q',
      default: false,
      description: 'Suppress output except for errors',
    }),
  }

  public async run(): Promise<void> {
    const revokeKey = async () => {
      const {apiKeyId} = this.args
      await revokeAPIKey(apiKeyId)
      console.log(`Revoked API key with ID: ${getShortUUID(apiKeyId)}`)
    }

    const handleComplete = async () => {
      process.exit(0)
    }

    if (this.flags.quiet) return await revokeKey()

    render(
      <Command command={this}>
        <RunWithSpinner
          executeMethod={revokeKey}
          msgComplete="ShipThis API key revoked successfully"
          msgInProgress="Revoking ShipThis API key..."
          onComplete={handleComplete}
        />
      </Command>,
    )
  }
}
