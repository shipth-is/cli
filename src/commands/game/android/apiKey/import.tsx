import {Flags, Args} from '@oclif/core'
import {render} from 'ink'
import * as fs from 'fs'

import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {getProjectCredentials, importCredential} from '@cli/api/credentials/index.js'
import {Command, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class GameAndroidApiKeyImport extends BaseGameAndroidCommand<typeof GameAndroidApiKeyImport> {
  static override args = {
    file: Args.string({
      description: 'Name of the ZIP file to import (must be in the same format as the export)',
      required: true,
    }),
  }

  static override description =
    'Imports an Android Service Account API Key to your ShipThis account for the specified game.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const {args, flags} = this
    const {file} = args
    const {force} = flags

    const zipFound = fs.existsSync(file)
    if (!zipFound) {
      this.error(`The file ${file} does not exist.`)
    }

    const projectCredentials = await getProjectCredentials(game.id)
    const hasAndroidApiKey = projectCredentials.some(
      (cred) => cred.platform == Platform.ANDROID && cred.isActive && cred.type == CredentialsType.KEY,
    )

    if (hasAndroidApiKey && !force) {
      this.error('An Android API Key is already set on this game. Use --force to overwrite it.')
    }

    const handleComplete = async () => {
      await this.config.runCommand(`game:android:apiKey:status`, ['--gameId', game.id])
    }

    render(
      <Command command={this}>
        <RunWithSpinner
          msgInProgress={`Importing Android Service Account API Key from ${file}...`}
          msgComplete={`Android Android Service Account API Key imported from ${file}`}
          executeMethod={() =>
            importCredential({
              projectId: game.id,
              zipPath: file,
              type: CredentialsType.KEY,
              platform: Platform.ANDROID,
            })
          }
          onComplete={handleComplete}
        />
      </Command>,
    )
  }
}
