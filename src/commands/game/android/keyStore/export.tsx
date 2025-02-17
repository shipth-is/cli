import {Flags, Args} from '@oclif/core'
import {render} from 'ink'
import * as fs from 'fs'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {exportCredential, getProjectCredentials} from '@cli/api/credentials/index.js'
import {Command, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class GameAndroidKeyStoreExport extends BaseGameCommand<typeof GameAndroidKeyStoreExport> {
  static override args = {
    file: Args.string({description: 'Name of the ZIP file to create', required: true}),
  }

  static override description = 'Saves the current Android Keystore to a ZIP file'

  static override examples = ['<%= config.bin %> <%= command.id %> keyStore.zip']

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    force: Flags.boolean({char: 'f', description: 'Overwrite the file if it already exists'}),
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
    const projectAndroidKeyStoreCreds = projectCredentials.filter(
      (cred) => cred.platform == Platform.ANDROID && cred.type == CredentialsType.CERTIFICATE && cred.isActive,
    )

    if (projectAndroidKeyStoreCreds.length === 0) {
      this.error('No Android Keystore found which can be exported.')
    }

    const [keyStore] = projectAndroidKeyStoreCreds

    const handleComplete = async () => process.exit(0)

    render(
      <Command command={this}>
        <RunWithSpinner
          msgInProgress={`Exporting Android Keystore to ${file}...`}
          msgComplete={`Android Keystore exported to ${file}`}
          executeMethod={() => exportCredential({zipPath: file, credentialId: keyStore.id, projectId: game.id})}
          onComplete={handleComplete}
        />
      </Command>,
    )
  }
}
