import {Flags} from '@oclif/core'
import {render} from 'ink'

import {BaseAppleCommand} from '@cli/baseCommands/index.js'
import {getUserCredentials, uploadUserCredentials, UserKey_iOS} from '@cli/api/credentials/index.js'
import {App, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types.js'
import {ApiKey, ApiKeyType, UserRole} from '@cli/apple/expo.js'

export default class AppleApiKeyCreate extends BaseAppleCommand<typeof AppleApiKeyCreate> {
  static override args = {}

  static override description =
    'Creates an App Store Connect API in your Apple Developer account and saves the private key in your ShipThis account'

  static override examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --force']

  static override flags = {
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const {flags} = this
    const {force} = flags

    const userCredentials = await getUserCredentials()
    const userAppleApiKeyCredentials = userCredentials.filter(
      (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.KEY,
    )

    if (userAppleApiKeyCredentials.length !== 0 && !force) {
      this.error('An App Store Connect API already exists. Use --force to overwrite it.')
    }

    const authState = await this.refreshAppleAuthState()
    const ctx = authState.context

    const createApiKey = async () => {
      const userKey = await ApiKey.createAsync(ctx, {
        nickname: `ShipThis ${Math.floor(new Date().valueOf() / 1000)}`,
        allAppsVisible: true,
        roles: [UserRole.ADMIN],
        keyType: ApiKeyType.PUBLIC_API,
      })

      const keyContent = await userKey.downloadAsync()
      if (!keyContent) throw new Error('Failed to download key content')

      // To get the issuer correctly we have to reload
      const reloadedKey = await ApiKey.infoAsync(ctx, {id: userKey.id})
      const key: UserKey_iOS = {
        keyId: userKey.id,
        issuer: `${reloadedKey.attributes.provider?.id}`,
        p8Content: keyContent,
        serialNumber: userKey.id,
      }

      await uploadUserCredentials({
        platform: Platform.IOS,
        type: CredentialsType.KEY,
        contents: key,
        serialNumber: key.serialNumber,
      })
    }

    const handleComplete = async () => {
      await this.config.runCommand(`apple:apiKey:status`)
    }

    if (this.flags.quiet) {
      await createApiKey()
      return this.exit(0)
    }

    render(
      <App>
        <RunWithSpinner
          msgInProgress={`Creating App Store Connect API in the Apple Developer Portal...`}
          msgComplete={`App Store Connect API created and saved to ShipThis`}
          executeMethod={createApiKey}
          onComplete={handleComplete}
        />
      </App>,
    )
  }
}
