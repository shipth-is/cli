import {render} from 'ink'
import {Flags} from '@oclif/core'

import {App, AppleProfilesTable, NextSteps, ProjectCredentialsTable} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class GameIosProfileStatus extends BaseGameCommand<typeof GameIosProfileStatus> {
  static override args = {}

  static override description =
    'Shows the Game iOS Mobile Provisioning Profile Status. If --gameId is not provided it will look in the current directory.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    noAppleAuth: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const {flags} = this
    const showApple = !flags.noAppleAuth

    const game = await this.getGame()

    let ctx = null
    if (showApple) {
      const authState = await this.refreshAppleAuthState()
      ctx = authState.context
    }

    render(
      <App>
        <ProjectCredentialsTable
          credentialTypeName="Mobile Provisioning Profile"
          queryProps={{platform: Platform.IOS, type: CredentialsType.CERTIFICATE, projectId: game.id}}
        />

        {showApple && <AppleProfilesTable ctx={ctx} project={game} />}

        <NextSteps steps={[]} />
      </App>,
    )
  }
}
