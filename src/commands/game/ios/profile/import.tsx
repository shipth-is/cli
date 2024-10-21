import {Flags, Args} from '@oclif/core'
import {render} from 'ink'
import * as fs from 'fs'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProjectCredentials, importCredential} from '@cli/api/credentials/index.js'
import {App, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class GameIosProfileImport extends BaseGameCommand<typeof GameIosProfileImport> {
  static override args = {
    file: Args.string({
      description: 'Name of the ZIP file to import (must be in the same format as the export)',
      required: true,
    }),
  }

  static override description = 'Imports an Mobile Provisioning Profile to your ShipThis account'

  static override examples = ['<%= config.bin %> <%= command.id %> profile.zip']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = this
    const {file} = args
    const {force} = flags

    const game = await this.getGame() // ensure we have access

    const zipFound = fs.existsSync(file)
    if (!zipFound) {
      this.error(`The file ${file} does not exist.`)
    }

    const projectCredentials = await getProjectCredentials(game.id)
    const projectAppleProfileCredentials = projectCredentials.filter(
      (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.CERTIFICATE,
    )

    if (projectAppleProfileCredentials.length !== 0 && !force) {
      this.error('A Mobile Provisioning Profile already exists. Use --force to overwrite it.')
    }

    const handleComplete = async () => {
      await this.config.runCommand(`game:ios:profile:status`, ['--noAppleAuth', '--gameId', game.id])
    }

    render(
      <App>
        <RunWithSpinner
          msgInProgress={`Importing Mobile Provisioning Profile from ${file}...`}
          msgComplete={`Mobile Provisioning Profile imported from ${file}`}
          executeMethod={() =>
            importCredential({
              zipPath: file,
              type: CredentialsType.CERTIFICATE,
              platform: Platform.IOS,
              projectId: game.id,
            })
          }
          onComplete={handleComplete}
        />
      </App>,
    )
  }
}
