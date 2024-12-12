import {render} from 'ink'
import {Flags} from '@oclif/core'

import {App, ProjectCredentialsTable} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {CredentialsType, Platform} from '@cli/types/api.js'

export default class GameAndroidKeyStoreStatus extends BaseGameCommand<typeof GameAndroidKeyStoreStatus> {
  static override args = {}

  static override description = 'Displays the status of the Android Keystore for a specific game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()

    render(
      <App>
        <ProjectCredentialsTable
          credentialTypeName="Android Keystore"
          queryProps={{
            projectId: game.id,
            type: CredentialsType.CERTIFICATE,
            platform: Platform.ANDROID,
          }}
        />
      </App>,
    )
  }
}
