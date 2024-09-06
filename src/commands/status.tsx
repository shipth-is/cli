import axios from 'axios'
import {Flags, ux} from '@oclif/core'
import {promises as readline} from 'node:readline'
import {render} from 'ink'

import {BaseCommand} from '@cli/baseCommand'
import {API_URL} from '@cli/config'

import {StatusTable} from '@cli/components'

export default class Status extends BaseCommand<typeof Status> {
  static override args = {}

  static override description = 'Displays the current shipthis status - user, game and credentials'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const authConfig = await this.getAuthConfig()
    if (!authConfig.shipThisUser) {
      this.log('You are not logged in')
      return
    }
    render(<StatusTable />)
  }
}
