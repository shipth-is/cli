import {Flags} from '@oclif/core'
import {render, Box, Text} from 'ink'

import {BaseAuthenticatedCommand, DetailsFlags} from '@cli/baseCommands/index.js'
import {App} from '@cli/components/index.js'

import {AndroidWizard} from '@cli/components/AndroidWizard/index.js'

export default class GameAndroidWizard extends BaseAuthenticatedCommand<typeof GameAndroidWizard> {
  static override args = {}

  static override description = 'Prototype Android Wizard'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    ...DetailsFlags,
  }

  public async run(): Promise<void> {
    render(
      <App>
        <AndroidWizard command={this} />
      </App>,
    )
  }
}
