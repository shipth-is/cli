import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {Command, ProjectCredentialsTable} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types/api.js'
import {Flags} from '@oclif/core'
import {render} from 'ink'

export default class GameAndroidKeyStoreStatus extends BaseGameCommand<typeof GameAndroidKeyStoreStatus> {
  static override args = {}

  static override description = 'Displays the status of the Android Keystore for a specific game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    ...BaseGameCommand.flags,
  }

  public async run(): Promise<void> {
    const game = await this.getGame()

    render(
      <Command command={this}>
        <ProjectCredentialsTable
          credentialTypeName="Android Keystore"
          queryProps={{
            platform: Platform.ANDROID,
            projectId: game.id,
            type: CredentialsType.CERTIFICATE,
          }}
        />
      </Command>,
    )
  }
}
