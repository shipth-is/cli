import {Flags, Args} from '@oclif/core'
import {render} from 'ink'
import * as fs from 'fs'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {exportCredential, getUserCredentials} from '@cli/api/credentials/index.js'
import {App, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types.js'

export default class AppleApiKeyExport extends BaseAuthenticatedCommand<typeof AppleApiKeyExport> {
  static override args = {
    file: Args.string({description: 'Name of the ZIP file to create', required: true}),
  }

  static override description = 'Saves the current App Store Connect API Key to a ZIP file'

  static override examples = ['<%= config.bin %> <%= command.id %> userApiKey.zip']

  static override flags = {
    force: Flags.boolean({char: 'f', description: 'Overwrite the file if it already exists'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = this
    const {file} = args
    const {force} = flags

    const zipAlreadyExists = fs.existsSync(file)
    if (zipAlreadyExists && !force) {
      this.error(`The file ${file} already exists. Use --force to overwrite it.`)
    }

    const userCredentials = await getUserCredentials()
    const userAppleApiKeyCredentials = userCredentials.filter(
      (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.KEY,
    )

    if (userAppleApiKeyCredentials.length === 0) {
      this.error('No App Store Connect API Key found which can be exported.')
    }

    const [key] = userAppleApiKeyCredentials

    const handleComplete = async () => process.exit(0)

    render(
      <App>
        <RunWithSpinner
          msgInProgress={`Exporting App Store Connect API Key to ${file}...`}
          msgComplete={`App Store Connect API Key exported to ${file}`}
          executeMethod={() => exportCredential({zipPath: file, credentialId: key.id})}
          onComplete={handleComplete}
        />
      </App>,
    )
  }
}
