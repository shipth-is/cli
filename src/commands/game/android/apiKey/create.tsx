import {render} from 'ink'
import {Flags} from '@oclif/core'
import open from 'open'

import {App, RunWithSpinner} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProjectCredentials, getSingleUseUrl} from '@cli/api/index.js'
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
    quiet: Flags.boolean({char: 'q', description: 'Avoid output except for interactions and errors'}),
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()

    const projectCredentials = await getProjectCredentials(game.id)
    const hasApiKey = projectCredentials.some(
      (cred) => cred.platform == Platform.ANDROID && cred.isActive && cred.type == CredentialsType.KEY,
    )

    if (hasApiKey && !this.flags.force) {
      this.error('An API Key is already set on this game. Use --force to overwrite it.')
    }

    const createApiKey = async () => {
      // TODO: this does not create the key they have to click buttons!
      const url = await getSingleUseUrl(`/games/${game.id}/android`)
      await open(url)
    }

    const handleComplete = async () => {
      return
    }

    if (this.flags.quiet) return await createApiKey()

    render(
      <App>
        <RunWithSpinner
          msgInProgress="Creating a new Android Service Account API Key..."
          msgComplete="Android Service Account API Key created"
          executeMethod={createApiKey}
          onComplete={handleComplete}
        />
      </App>,
    )
  }
}
