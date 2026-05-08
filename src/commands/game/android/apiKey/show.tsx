import {Args, Flags} from '@oclif/core'
import {render} from 'ink'

import {getProjectCredentials} from '@cli/api/credentials/index.js'
import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {CommandGame, CredentialDetailsView} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class GameAndroidApiKeyShow extends BaseGameAndroidCommand<typeof GameAndroidApiKeyShow> {
  static override args = {
    id: Args.string({
      description: 'Credential ID (full or short prefix). Defaults to the active key.',
      required: false,
    }),
  }

  static override description =
    'Shows expanded details (service account email) for the Android Service Account API Key in your ShipThis account.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> d69f28c5',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const {args} = this
    const game = await this.getGame()
    const credentials = await getProjectCredentials(game.id)
    const keys = credentials.filter(
      (c) => c.platform === Platform.ANDROID && c.type === CredentialsType.KEY,
    )

    const match = args.id
      ? keys.find((c) => c.id === args.id || c.id.startsWith(args.id!))
      : keys.find((c) => c.isActive)

    if (!match) {
      this.error(
        args.id
          ? `No credential found matching ID/prefix: ${args.id}`
          : 'No active credential',
      )
    }

    render(
      <CommandGame command={this}>
        <CredentialDetailsView credential={match} title="Android Service Account API Key" />
      </CommandGame>,
    )
  }
}
