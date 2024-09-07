import axios from 'axios'
import {Flags, ux} from '@oclif/core'
import {promises as readline} from 'node:readline'
import {render} from 'ink'

import {BaseCommand} from '@cli/baseCommands'
import {API_URL} from '@cli/config'

import {Container, StatusTable} from '@cli/components'

export default class Status extends BaseCommand<typeof Status> {
  static override args = {}

  static override description = 'Displays the current shipthis status - user, game and credentials'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const authConfig = await this.getAuthConfig()

    const statusProps = {
      title: 'ShipThis Status',
      statuses: {
        'Logged in': !!authConfig.shipThisUser ? '✅' : '❌',
        'Game in current directory': '❌',
      },
    }

    render(
      <Container>
        <StatusTable {...statusProps} />
      </Container>,
    )
  }
}
