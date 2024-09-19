import {Flags, Args} from '@oclif/core'
import {render} from 'ink'
import * as fs from 'fs'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {getUserCredentials} from '@cli/api/credentials/index.js'
import {App} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types.js'
import {CredentialImport} from '@cli/components/CredentialImport.js'

export default class AppleCertificateImport extends BaseAuthenticatedCommand<typeof AppleCertificateImport> {
  static override args = {
    file: Args.string({
      description: 'Name of the ZIP file to import (must be in the same format as the export)',
      required: true,
    }),
  }

  static override description = 'Imports an iOS Distribution Certificate to your shipthis account'

  static override examples = ['<%= config.bin %> <%= command.id %> userCert.zip']

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
    const userAppleDistCredentials = userCredentials.filter(
      (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.CERTIFICATE,
    )

    if (userAppleDistCredentials.length !== 0 && !force) {
      this.error('An Apple Distribution Certificate already exists. Use --force to overwrite it.')
    }

    const handleComplete = async () => {
      await this.config.runCommand(`apple:certificate:status`)
      process.exit(0)
    }

    render(
      <App>
        <CredentialImport
          zipPath={file}
          type={CredentialsType.CERTIFICATE}
          platform={Platform.IOS}
          onComplete={handleComplete}
        />
      </App>,
    )
  }
}
