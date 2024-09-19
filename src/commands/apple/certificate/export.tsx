import {Flags, Args} from '@oclif/core'
import {render} from 'ink'
import * as fs from 'fs'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {exportCredential, getUserCredentials} from '@cli/api/credentials/index.js'
import {App, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types.js'

export default class AppleCertificateExport extends BaseAuthenticatedCommand<typeof AppleCertificateExport> {
  static override args = {
    file: Args.string({description: 'Name of the ZIP file to create', required: true}),
  }

  static override description = 'Saves the current Apple Distribution Certificate to a ZIP file.'

  static override examples = ['<%= config.bin %> <%= command.id %> userCert.zip']

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
    const userAppleDistCredentials = userCredentials.filter(
      (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.CERTIFICATE,
    )

    if (userAppleDistCredentials.length === 0) {
      this.error('No Apple Distribution Certificate found which can be exported.')
    }

    const [cert] = userAppleDistCredentials

    const handleComplete = async () => process.exit(0)

    render(
      <App>
        <RunWithSpinner
          msgInProgress={`Exporting certificate to ${file}...`}
          msgComplete={`Certificate exported to ${file}`}
          executeMethod={() => exportCredential({zipPath: file, credentialId: cert.id})}
          onComplete={handleComplete}
        />
      </App>,
    )
  }
}
