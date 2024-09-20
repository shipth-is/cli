import {Flags} from '@oclif/core'
import {render, Box, Text} from 'ink'
import {DateTime} from 'luxon'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {ApiKey} from '@cli/apple/expo.js'
import {getUserCredentials} from '@cli/api/credentials/index.js'

import {App, NextSteps, Table} from '@cli/components/index.js'
import {getShortUUID} from '@cli/utils/index.js'
import {getShortDate} from '@cli/utils/dates.js'

import {CredentialsType, Platform} from '@cli/types.js'

export default class AppleApiKeyStatus extends BaseAuthenticatedCommand<typeof AppleApiKeyStatus> {
  static override args = {}

  static override description =
    'Displays the status of the App Store Connect API Key in your Apple and Shipthis accounts. This key is used to automatically publish your games to the App Store.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --noAppleAuth',
  ]

  static override flags = {
    noAppleAuth: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const {flags} = this

    const showApple = !flags.noAppleAuth

    const userCredentials = await getUserCredentials()

    const userAppleApiKeyCredentials = userCredentials.filter(
      (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.KEY,
    )

    const inShipThisTable = userAppleApiKeyCredentials.map((cred) => {
      return {
        id: getShortUUID(cred.id),
        type: cred.type,
        isActive: cred.isActive ? 'YES' : 'NO',
        createdAt: getShortDate(cred.createdAt),
      }
    })

    const hasUseableCertInShipthis = userAppleApiKeyCredentials.length > 0
    const steps = [!hasUseableCertInShipthis && '$ shipthis apple apiKey create'].filter(Boolean) as string[]

    let AppleAccountOutput = null

    if (showApple) {
      const authState = await this.refreshAppleAuthState()

      const ctx = authState.context

      const keys = await ApiKey.getAsync(ctx)

      const activeKeys = keys.filter((key) => key.attributes.isActive)

      const getCanBeUsed = (key: any) => {
        if (!key.attributes.isActive) return false
        return userCredentials.some((cred) => cred.isActive && cred.serialNumber == key.id)
      }

      const inAppleTable = activeKeys.map((key) => {
        return {
          keyID: key.id,
          name: key.attributes.nickname,
          roles: key.attributes.roles?.join(', '),
          lastUsed: getShortDate(DateTime.fromISO(key.attributes.lastUsed)),
          canBeUsed: getCanBeUsed(key) ? 'YES' : 'NO',
        }
      })

      const hasUseableKeyInApple = keys.some(getCanBeUsed)

      AppleAccountOutput = (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>IN YOUR APPLE ACCOUNT</Text>
          <Box marginLeft={2} marginBottom={1} flexDirection="column">
            <Text>{`You have ${keys.length} App Store Connect API Keys in your Apple account`}</Text>
            <Text>{`${hasUseableKeyInApple ? 'One' : 'None'} of these can be used by shipthis`}</Text>
          </Box>

          <Table
            data={inAppleTable}
            getTextStyles={(column, value) => {
              if (column.key != 'canBeUsed') return
              return {color: value == 'NO' ? 'red' : 'green'}
            }}
          />
          {!hasUseableKeyInApple && (
            <Box marginTop={1}>
              <Text bold>
                You do not have a usable App Store Connect API Keys. To ship an iOS game, you will need a usable API
                key.
              </Text>
            </Box>
          )}
        </Box>
      )
    }

    render(
      <App>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>IN YOUR SHIPTHIS ACCOUNT</Text>
          <Box marginLeft={2} marginBottom={1} flexDirection="column">
            <Text>
              {hasUseableCertInShipthis
                ? `You have an active App Store Connect API Key in your shipthis account.`
                : `You DO NOT have an active App Store Connect API Key which shipthis can use.`}
            </Text>
          </Box>
          <Table
            data={inShipThisTable}
            getTextStyles={(column, value) => {
              if (column.key != 'isActive') return
              return {color: value == 'NO' ? 'red' : 'green'}
            }}
          />
        </Box>

        {AppleAccountOutput}
        <NextSteps steps={steps} />
      </App>,
    )
  }
}
