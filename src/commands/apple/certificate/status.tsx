import {render, Box, Text} from 'ink'

import {BaseAppleCommand} from '@cli/baseCommands/index.js'
import {Certificate, CertificateType} from '@cli/apple/expo.js'
import {getUserCredentials} from '@cli/api/credentials/index.js'

import {App, NextSteps, Table} from '@cli/components/index.js'
import {getShortUUID} from '@cli/utils/index.js'
import {getShortDate} from '@cli/utils/dates.js'
import {DateTime} from 'luxon'

export default class AppleCertificateStatus extends BaseAppleCommand<typeof AppleCertificateStatus> {
  static override args = {}

  static override description =
    'Displays the status of the Apple certificate on your account. This is used to sign all of your iOS apps.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
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

    // Get the ones in shipthis
    const userCredentials = await getUserCredentials()
    const getCanBeUsed = (cert: any) => {
      if (cert.attributes.status != 'Issued') return false
      return userCredentials.some((cred) => cred.serialNumber == cert.attributes.serialNumber)
    }

    // Format the data for the table
    const appleCertTable = appleCerts.map((cert) => {
      return {
        id: getShortUUID(cert.id),
        name: cert.attributes.name,
        type: cert.attributes.certificateTypeName,
        expires: getShortDate(DateTime.fromISO(cert.attributes.expirationDate)),
        canBeUsed: getCanBeUsed(cert) ? 'YES' : 'NO',
      }
    })

    const hasUseableCert = !appleCertTable.some((cert) => cert.canBeUsed == 'YES')
    const steps = [!hasUseableCert && '$ shipthis apple certificate create'].filter(Boolean) as string[]

    render(
      <App>
        <Table
          data={appleCertTable}
          getTextStyles={(column, value) => {
            if (column.key != 'canBeUsed') return
            return {color: value == 'NO' ? 'red' : 'green'}
          }}
        />
        {!hasUseableCert && (
          <Box marginTop={1}>
            <Text bold>
              You do not have a usable apple certificate. To ship an iOS game, you will need a usable distribution
              certificate
            </Text>
          </Box>
        )}
        <NextSteps steps={steps} />
      </App>,
    )
  }
}
