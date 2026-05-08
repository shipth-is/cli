import {Args, Flags} from '@oclif/core'
import {render} from 'ink'

import {getProjectCredentials} from '@cli/api/credentials/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {CommandGame, CredentialDetailsView} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class GameIosProfileShow extends BaseGameCommand<typeof GameIosProfileShow> {
  static override args = {
    id: Args.string({
      description: 'Credential ID (full or short prefix). Defaults to the active profile.',
      required: false,
    }),
  }

  static override description =
    'Shows expanded details (expiry, entitlements) for the iOS Mobile Provisioning Profile in your ShipThis account.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> 6ff5a864',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const {args} = this
    const game = await this.getGame()
    const credentials = await getProjectCredentials(game.id)
    const profiles = credentials.filter(
      (c) => c.platform === Platform.IOS && c.type === CredentialsType.CERTIFICATE,
    )

    const match = args.id
      ? profiles.find((c) => c.id === args.id || c.id.startsWith(args.id!))
      : profiles.find((c) => c.isActive)

    if (!match) {
      this.error(
        args.id
          ? `No credential found matching ID/prefix "${args.id}"`
          : 'No active credential',
      )
    }

    render(
      <CommandGame command={this}>
        <CredentialDetailsView credential={match} title="iOS Mobile Provisioning Profile" />
      </CommandGame>,
    )
  }
}
