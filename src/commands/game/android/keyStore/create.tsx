import {render} from 'ink'
import {Flags} from '@oclif/core'

import {CommandGame, CreateKeystore} from '@cli/components/index.js'
import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {getProjectCredentials} from '@cli/api/index.js'
import {CredentialsType, Platform} from '@cli/types/api.js'

export default class GameAndroidKeyStoreCreate extends BaseGameAndroidCommand<typeof GameAndroidKeyStoreCreate> {
  static override args = {}

  static override description = 'Creates a new Android Keystore for a game'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    ...BaseGameAndroidCommand.flags,
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()

    const projectCredentials = await getProjectCredentials(game.id)
    const hasKeystore = projectCredentials.some(
      (cred) => cred.platform == Platform.ANDROID && cred.isActive && cred.type == CredentialsType.CERTIFICATE,
    )

    if (hasKeystore && !this.flags.force) {
      this.error('A Keystore is already set on this game. Use --force to overwrite it.')
    }

    render(
      <CommandGame command={this}>
        <CreateKeystore onComplete={() => process.exit(0)} onError={(e) => this.error(e)} />
      </CommandGame>,
    )
  }
}
