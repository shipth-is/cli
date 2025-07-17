import {getUserCredentials, importCredential} from '@cli/api/credentials/index.js'
import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {Command, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'
import {Args, Flags} from '@oclif/core'
import {render} from 'ink'
import * as fs from 'node:fs'

export default class AppleApiKeyImport extends BaseAuthenticatedCommand<typeof AppleApiKeyImport> {
  static override args = {
    file: Args.string({
      description: 'Name of the ZIP file to import (must be in the same format as the export)',
      required: true,
    }),
  }

  static override description = 'Imports an App Store Connect API Key ZIP file into your ShipThis account'

  static override examples = ['<%= config.bin %> <%= command.id %> userApiKey.zip']

  static override flags = {
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = this
    const {file} = args
    const {force} = flags

    const zipFound = fs.existsSync(file)
    if (!zipFound) {
      this.error(`The file ${file} does not exist.`)
    }

    const userCredentials = await getUserCredentials()
    const userAppleApiKeyCredentials = userCredentials.filter(
      (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.KEY,
    )

    if (userAppleApiKeyCredentials.length > 0 && !force) {
      this.error('An App Store Connect API Key already exists. Use --force to overwrite it.')
    }

    const handleComplete = async () => {
      await this.config.runCommand(`apple:apiKey:status`, ['--noAppleAuth'])
    }

    render(
      <Command command={this}>
        <RunWithSpinner
          executeMethod={() => importCredential({platform: Platform.IOS, type: CredentialsType.KEY, zipPath: file})}
          msgComplete={`App Store Connect API imported from ${file}`}
          msgInProgress={`Importing App Store Connect API from ${file}...`}
          onComplete={handleComplete}
        />
      </Command>,
    )
  }
}
