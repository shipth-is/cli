import {render} from 'ink'

import {BaseCommand} from '@cli/baseCommands/index.js'
import {Container, Environment, NextSteps, StatusTable} from '@cli/components/index.js'
import {isCWDGodotGame} from '@cli/utils/index.js'
import {AuthConfig} from '@cli/types.js'

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
      },
    }

    render(
      <Container>
        <StatusTable {...statusProps} />
        <Environment />
        <NextSteps steps={steps} />
      </Container>,
    )
  }
}
