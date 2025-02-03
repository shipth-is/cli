import {render} from 'ink'
import {Flags} from '@oclif/core'

import {AndroidCreateServiceAccountKey, App} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getGoogleStatus, getProjectCredentials} from '@cli/api/index.js'
import {CredentialsType, Platform} from '@cli/types/api.js'
export default class GameAndroidApiKeyCreate extends BaseGameCommand<typeof GameAndroidApiKeyCreate> {
  static override args = {}

  static override description = 'Creates a new Android Service Account API Key for a game'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    //quiet: Flags.boolean({char: 'q', description: 'Avoid output except for interactions and errors'}),
    force: Flags.boolean({char: 'f'}),
    waitForAuth: Flags.boolean({char: 'p', description: 'Waits for Google Auth to be completed'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()

    // TODO: waitForAuth
    const {force, waitForAuth} = this.flags

    const projectCredentials = await getProjectCredentials(game.id)
    const hasApiKey = projectCredentials.some(
      (cred) => cred.platform == Platform.ANDROID && cred.isActive && cred.type == CredentialsType.KEY,
    )

    if (hasApiKey && !force) {
      this.error('An API Key is already set on this game. Use --force to overwrite it.')
    }

    const {isAuthenticated} = await getGoogleStatus()
    if (!isAuthenticated) {
      this.error('You must connect to Google first. Run `shipthis game android apiKey connect`', {exit: 1})
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
