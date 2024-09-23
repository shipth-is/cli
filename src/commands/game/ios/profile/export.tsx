import {Flags, Args} from '@oclif/core'
import {render} from 'ink'
import * as fs from 'fs'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {exportCredential, getProjectCredentials} from '@cli/api/credentials/index.js'
import {App, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types.js'

export default class GameIosProfileExport extends BaseGameCommand<typeof GameIosProfileExport> {
  static override args = {
    file: Args.string({description: 'Name of the ZIP file to create', required: true}),
  }

  static override description = 'Saves the current Mobile Provisioning Profile to a ZIP file'

  static override examples = ['<%= config.bin %> <%= command.id %> userProfile.zip']

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
    const userAppleProfileCredentials = projectCredentials.filter(
      (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.CERTIFICATE,
    )

    if (userAppleProfileCredentials.length === 0) {
      this.error('No Mobile Provisioning Profile found which can be exported.')
    }

    const [profile] = userAppleProfileCredentials

    const handleComplete = async () => process.exit(0)

    render(
      <App>
        <RunWithSpinner
          msgInProgress={`Exporting Mobile Provisioning Profile to ${file}...`}
          msgComplete={`Mobile Provisioning Profile exported to ${file}`}
          executeMethod={() => exportCredential({zipPath: file, credentialId: profile.id, projectId: game.id})}
          onComplete={handleComplete}
        />
      </App>,
    )
  }
}
