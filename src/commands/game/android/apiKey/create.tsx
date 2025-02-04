import {render} from 'ink'
import {Flags} from '@oclif/core'

import {AndroidCreateServiceAccountKey, App} from '@cli/components/index.js'
import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {getProjectCredentials} from '@cli/api/index.js'
import {CredentialsType, Platform} from '@cli/types/api.js'
export default class GameAndroidApiKeyCreate extends BaseGameAndroidCommand<typeof GameAndroidApiKeyCreate> {
  static override args = {}

  static override description = 'Creates a new Android Service Account API Key for a game'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    ...BaseGameAndroidCommand.flags,
    waitForAuth: Flags.boolean({char: 'w', description: 'Wait for Google Authentication (10 mins).'}),
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()

    const {force, waitForAuth} = this.flags

    this.checkGoogleAuth(waitForAuth)

    const projectCredentials = await getProjectCredentials(game.id)
    const hasApiKey = projectCredentials.some(
      (cred) => cred.platform == Platform.ANDROID && cred.isActive && cred.type == CredentialsType.KEY,
    )

    if (hasApiKey && !force) {
      this.error('An API Key is already set on this game. Use --force to overwrite it.')
    }

    render(
      <App>
        <AndroidCreateServiceAccountKey
          projectId={game.id}
          onComplete={async function (): Promise<void> {
            process.exit(0)
          }}
          onError={function (error: Error): void {
            throw error
          }}
        />
      </App>,
    )
  }
}
