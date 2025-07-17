import {Flags} from '@oclif/core'
import {render} from 'ink'

import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {Command, ProjectCredentialsTable, Table, Title} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types/api.js'
import {KeyTestStatus, fetchKeyTestResult, niceError} from '@cli/utils/query/useAndroidServiceAccountTestResult.js'

export default class GameAndroidApiKeyStatus extends BaseGameAndroidCommand<typeof GameAndroidApiKeyStatus> {
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
    // TODO: next steps
    render(
      <Command command={this}>
        <ProjectCredentialsTable
          credentialTypeName="Android Service Account API Key"
          queryProps={{
            platform: Platform.ANDROID,
            projectId: game.id,
            type: CredentialsType.KEY,
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
      </Command>,
    )
  }
}
