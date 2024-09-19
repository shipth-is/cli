import {Flags} from '@oclif/core'
import {render, Box, Text} from 'ink'
import {DateTime} from 'luxon'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {Certificate, CertificateType} from '@cli/apple/expo.js'
import {getUserCredentials} from '@cli/api/credentials/index.js'

import {App, NextSteps, Table} from '@cli/components/index.js'
import {getShortUUID} from '@cli/utils/index.js'
import {getShortDate} from '@cli/utils/dates.js'

import {CredentialsType, Platform} from '@cli/types.js'

export default class AppleCertificateStatus extends BaseAuthenticatedCommand<typeof AppleCertificateStatus> {
  static override args = {}

  static override description =
    'Displays the status of the certificates in your Apple account. These are used to sign all of your iOS apps.'

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

    // Get the credentials in shipthis
    const userCredentials = await getUserCredentials()
    const getCanBeUsed = (cert: any) => {
      if (cert.attributes.status != 'Issued') return false
      return userCredentials.some((cred) => cred.serialNumber == cert.attributes.serialNumber)
    }

    const userAppleDistCredentials = userCredentials.filter(
      (cred) => cred.platform == Platform.IOS && cred.type == CredentialsType.CERTIFICATE,
    )

    // Output for the table
    const inShipThisTable = userAppleDistCredentials.map((cred) => {
      return {
        id: getShortUUID(cred.id),
        type: cred.type,
        serial: cred.serialNumber,
        isActive: cred.isActive ? 'YES' : 'NO',
        createdAt: getShortDate(cred.createdAt),
      }
    })

    const hasUseableCertInShipthis = userAppleDistCredentials.length > 0
    const steps = [!hasUseableCertInShipthis && '$ shipthis apple certificate create'].filter(Boolean) as string[]

    // Apple content is optionally rendered
    let AppleAccountOutput = null

    if (showApple) {
      const authState = await this.refreshAppleAuthState()

      const ctx = authState.context

      // Get the certs from apple
      const appleCerts = await Certificate.getAsync(ctx, {
        query: {
          filter: {
            certificateType: [CertificateType.DISTRIBUTION, CertificateType.IOS_DISTRIBUTION],
          },
        },
      })

      // Format the data for the table
      const inAppleTable = appleCerts.map((cert) => {
        return {
          id: getShortUUID(cert.id),
          name: cert.attributes.name,
          serial: cert.attributes.serialNumber,
          expires: getShortDate(DateTime.fromISO(cert.attributes.expirationDate)),
          canBeUsed: getCanBeUsed(cert) ? 'YES' : 'NO',
        }
      })

      const hasUseableCertInApple = inAppleTable.some((cert) => cert.canBeUsed == 'YES')

      AppleAccountOutput = (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>IN YOUR APPLE ACCOUNT</Text>
          <Box marginLeft={2} marginBottom={1} flexDirection="column">
            <Text>{`You have ${appleCerts.length} certificates in your Apple account`}</Text>
          </Box>

          <Table
            data={inAppleTable}
            getTextStyles={(column, value) => {
              if (column.key != 'canBeUsed') return
              return {color: value == 'NO' ? 'red' : 'green'}
            }}
          />
          {!hasUseableCertInApple && (
            <Box marginTop={1}>
              <Text bold>
                You do not have a usable apple certificate. To ship an iOS game, you will need a usable distribution
                certificate
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
                ? `You have an active Apple iOS Distribution Certificate in your shipthis account.`
                : `You DO NOT have an active certificate which shipthis can use.`}
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
