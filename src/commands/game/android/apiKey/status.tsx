import {render} from 'ink'
import {Flags} from '@oclif/core'

import {App, ProjectCredentialsTable, Table, Title} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {CredentialsType, Platform} from '@cli/types/api.js'
import {fetchKeyTestResult, KeyTestError, KeyTestStatus} from '@cli/utils/query/useAndroidServiceAccountTestResult.js'

function niceError(keyError: KeyTestError | undefined): string | undefined {
  if (!keyError) return undefined
  switch (keyError) {
    case KeyTestError.NO_SERVICE_ACCOUNT_KEY:
      return 'Service Account API Key not found in your account'
    case KeyTestError.NO_PACKAGE_NAME:
      return 'Android Package Name has not been set'
    case KeyTestError.APP_NOT_FOUND:
      return 'Application not found in Google Play Console'
    case KeyTestError.NOT_INVITED:
      return 'Service Account has not been invited to Google Play'
    default:
      throw new Error(`Unknown error: ${keyError}`)
  }
}

export default class GameAndroidApiKeyStatus extends BaseGameCommand<typeof GameAndroidApiKeyStatus> {
  static override args = {}

  static override description = 'Displays the status of the Android Service Account API Key for a specific game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()

    const testResult = await fetchKeyTestResult({projectId: game.id})

    render(
      <App>
        <ProjectCredentialsTable
          credentialTypeName="Android Service Account API Key"
          queryProps={{
            projectId: game.id,
            type: CredentialsType.KEY,
            platform: Platform.ANDROID,
          }}
        />
        <Title>Android Service Account API Key Test Result</Title>
        <Table
          data={[
            {
              'Key Works?': testResult.status == KeyTestStatus.SUCCESS,
              ...testResult,
              error: niceError(testResult.error),
            },
          ]}
        />
      </App>,
    )
  }
}
