import {render} from 'ink'
import {Flags} from '@oclif/core'
import axios from 'axios'

import {App, RunWithSpinner} from '@cli/components/index.js'
import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {getAuthedHeaders, getProjectCredentials} from '@cli/api/index.js'
import {CredentialsType, Platform} from '@cli/types/api.js'
import {API_URL} from '@cli/constants/index.js'

export default class GameAndroidKeyStoreCreate extends BaseGameAndroidCommand<typeof GameAndroidKeyStoreCreate> {
  static override args = {}

  static override description = 'Creates a new Android Keystore for a game'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    quiet: Flags.boolean({char: 'q', description: 'Avoid output except for interactions and errors'}),
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

    const createKeystore = async () => {
      // This is v simple
      const headers = await getAuthedHeaders()
      await axios.post(`${API_URL}/projects/${game.id}/credentials/android/certificate`, null, {
        headers,
      })
    }

    const handleComplete = async () => {
      return
    }

    if (this.flags.quiet) return await createKeystore()

    render(
      <App>
        <RunWithSpinner
          msgInProgress="Creating a new Android Keystore..."
          msgComplete="Android Keystore created"
          executeMethod={createKeystore}
          onComplete={handleComplete}
        />
      </App>,
    )
  }
}
