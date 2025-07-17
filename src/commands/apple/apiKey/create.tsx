import {Flags} from '@oclif/core'
import {render} from 'ink'

import {UserKey_iOS, getUserCredentials, uploadUserCredentials} from '@cli/api/credentials/index.js'
import {ApiKey, ApiKeyType, UserRole} from '@cli/apple/expo.js'
import {BaseAppleCommand} from '@cli/baseCommands/index.js'
import {Command, RunWithSpinner} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'

export default class AppleApiKeyCreate extends BaseAppleCommand<typeof AppleApiKeyCreate> {
  static override args = {}

  static override description =
    'Creates an App Store Connect API Key in your Apple Developer account.\nSaves the private key in your ShipThis account.'

  static override examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --force']

  static override flags = {
    force: Flags.boolean({char: 'f'}),
    quiet: Flags.boolean({char: 'q', description: 'Avoid output except for interactions and errors'}),
  }

  public async run(): Promise<void> {
    const {flags} = this
    const {force} = flags

    const userCredentials = await getUserCredentials()
    const userAppleApiKeyCredentials = userCredentials.filter(
      (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.KEY,
    )

    if (userAppleApiKeyCredentials.length > 0 && !force) {
      this.error('An App Store Connect API already exists. Use --force to overwrite it.')
    }

    const authState = await this.refreshAppleAuthState()
    const ctx = authState.context

    const createApiKey = async () => {
      const userKey = await ApiKey.createAsync(ctx, {
        allAppsVisible: true,
        keyType: ApiKeyType.PUBLIC_API,
        nickname: `ShipThis ${Math.floor(Date.now() / 1000)}`,
        roles: [UserRole.ADMIN],
      })

      const keyContent = await userKey.downloadAsync()
      if (!keyContent) throw new Error('Failed to download key content')

      // To get the issuer correctly we have to reload
      const reloadedKey = await ApiKey.infoAsync(ctx, {id: userKey.id})
      const key: UserKey_iOS = {
        issuer: `${reloadedKey.attributes.provider?.id}`,
        keyId: userKey.id,
        p8Content: keyContent,
        serialNumber: userKey.id,
      }

      await uploadUserCredentials({
        contents: key,
        platform: Platform.IOS,
        serialNumber: key.serialNumber,
        type: CredentialsType.KEY,
      })
    }

    const handleComplete = async () => {
      await this.config.runCommand(`apple:apiKey:status`)
    }

    if (this.flags.quiet) return await createApiKey()

    render(
      <Command command={this}>
        <RunWithSpinner
          executeMethod={createApiKey}
          msgComplete={`App Store Connect API created and saved to ShipThis`}
          msgInProgress={`Creating App Store Connect API in the Apple Developer Portal...`}
          onComplete={handleComplete}
        />
      </Command>,
    )
  }
}
