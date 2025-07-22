import * as fs from 'node:fs'

import {Args, Flags} from '@oclif/core'
import {render} from 'ink'

import {exportCredential, getProjectCredentials} from '@cli/api/credentials/index.js'
import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {Command, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'


export default class GameAndroidApiKeyExport extends BaseGameAndroidCommand<typeof GameAndroidApiKeyExport> {
  static override args = {
    file: Args.string({description: 'Name of the ZIP file to create', required: true}),
  }

  static override description = 'Saves the current Android Service Account API Key to a ZIP file'

  static override examples = ['<%= config.bin %> <%= command.id %> keyStore.zip']

  static override flags = {
    force: Flags.boolean({char: 'f', description: 'Overwrite the file if it already exists'}),
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = this
    const {file} = args
    const {force} = flags

    const game = await this.getGame() // ensure we have access

    const zipAlreadyExists = fs.existsSync(file)
    if (zipAlreadyExists && !force) {
      this.error(`The file ${file} already exists. Use --force to overwrite it.`)
    }

    const projectCredentials = await getProjectCredentials(game.id)
    const projectAndroidApiKeyCreds = projectCredentials.filter(
      (cred) => cred.platform === Platform.ANDROID && cred.type === CredentialsType.KEY && cred.isActive,
    )

    if (projectAndroidApiKeyCreds.length === 0) {
      this.error('No Android Service Account API Key found which can be exported.')
    }

    const [apiKey] = projectAndroidApiKeyCreds

    const handleComplete = async () => process.exit(0)

    render(
      <Command command={this}>
        <RunWithSpinner
          executeMethod={() => exportCredential({credentialId: apiKey.id, projectId: game.id, zipPath: file})}
          msgComplete={`Android Service Account API Key exported to ${file}`}
          msgInProgress={`Exporting Android Service Account API Key to ${file}...`}
          onComplete={handleComplete}
        />
      </Command>,
    )
  }
}
