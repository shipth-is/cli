import {BaseCommand} from '@cli/baseCommands/index.js'
import {Command, NextSteps, StatusTable} from '@cli/components/index.js'
import {AuthConfig} from '@cli/types'
import {isCWDGitRepo, isCWDGodotGame} from '@cli/utils/index.js'
import {render} from 'ink'

export default class Status extends BaseCommand<typeof Status> {
  static override args = {}

  static override description = 'Displays the current overall status.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const authConfig: AuthConfig = await this.getAuthConfig()

    const isLoggedIn = Boolean(authConfig.shipThisUser)
    const isGodotGame = isCWDGodotGame()
    const isShipThisConfigured = await this.hasProjectConfig()
    const isGitRepo = await isCWDGitRepo()

    let steps = []

    if (!isLoggedIn) steps.push('shipthis login --email my.email@address.nowhere')
    if (!isGodotGame) steps.push('Run this command in a Godot project directory')
    if (!isShipThisConfigured) steps.push('shipthis game wizard')

    const exitCode = steps.length > 0 ? 1 : 0

    if (steps.length === 0) steps = ['shipthis game status']

    const statusProps = {
      statuses: {
        'Git repository detected (not required)': isGitRepo,
        'Godot project detected': isGodotGame,
        'Logged in': isLoggedIn,
        'ShipThis project configured': isShipThisConfigured,
      },
      title: 'Status',
    }

    render(
      <Command command={this}>
        <StatusTable {...statusProps} />
        <NextSteps steps={steps} />
      </Command>,
    )

    return process.exit(exitCode)
  }
}
