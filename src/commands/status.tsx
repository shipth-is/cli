import {render} from 'ink'

import {BaseCommand} from '@cli/baseCommands/index.js'
import {App, Environment, NextSteps, StatusTable} from '@cli/components/index.js'
import {isCWDGitRepo, isCWDGodotGame} from '@cli/utils/index.js'
import {AuthConfig} from '@cli/types'

export default class Status extends BaseCommand<typeof Status> {
  static override args = {}

  static override description = 'Displays the current overall status.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const authConfig: AuthConfig = await this.getAuthConfig()

    const isLoggedIn = !!authConfig.shipThisUser
    const isGodotGame = isCWDGodotGame()
    const isShipThisConfigured = await this.hasProjectConfig()
    const isGitRepo = await isCWDGitRepo()

    let steps = []

    if (!isLoggedIn) steps.push('$ shipthis login --email my.email@address.nowhere')
    if (!isGodotGame) steps.push('Run this command in a Godot project directory')
    if (!isShipThisConfigured) steps.push('$ shipthis game create --name "My Awesome Game"')

    if (steps.length === 0) steps = ['$ shipthis game status']

    const statusProps = {
      title: 'Status',
      statuses: {
        'Logged in': isLoggedIn,
        'Godot project detected': isGodotGame,
        'ShipThis project configured': isShipThisConfigured,
        'Git repository detected (not required)': isGitRepo,
      },
    }

    render(
      <App>
        <StatusTable {...statusProps} />
        <Environment />
        <NextSteps steps={steps} />
      </App>,
    )
  }
}
