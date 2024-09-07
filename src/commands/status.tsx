import {render} from 'ink'

import {BaseCommand} from '@cli/baseCommands/index.js'
import {Container, NextSteps, StatusTable} from '@cli/components/index.js'
import {isCWDGodotGame} from '@cli/utils/index.js'

export default class Status extends BaseCommand<typeof Status> {
  static override args = {}

  static override description = 'Displays the current shipthis status'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const authConfig = await this.getAuthConfig()

    const isLoggedIn = !!authConfig.shipThisUser
    const isGodotGame = isCWDGodotGame()
    const isShipThisConfigured = await this.hasProjectConfig()

    let steps = []

    if (!isLoggedIn) steps.push('$ shipthis login --email my.email@address.nowhere')
    if (!isGodotGame) steps.push('Run this command in a Godot project directory')
    if (!isShipThisConfigured) steps.push('$ shipthis game create --name "My Awesome Game"')

    const statusProps = {
      title: 'ShipThis Status',
      statuses: {
        'Logged in': isLoggedIn,
        'Godot project detected': isGodotGame,
        'ShipThis project configured': isShipThisConfigured,
      },
    }

    render(
      <Container>
        <StatusTable {...statusProps} />
        <NextSteps steps={steps} />
      </Container>,
    )
  }
}
