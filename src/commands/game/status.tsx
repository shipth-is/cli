import {render, Box, Text} from 'ink'
import {Flags} from '@oclif/core'

import {App, NextSteps, StatusTable} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProjectPlatformProgress} from '@cli/api/index.js'
import {Platform} from '@cli/types.js'

export default class GameStatus extends BaseGameCommand<typeof GameStatus> {
  static override args = {}

  static override description =
    'Shows the Game status. If --gameId is not provided it will look in the current directory.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const iosPlatformStatus = await getProjectPlatformProgress(game.id, Platform.IOS)
    const androidPlatformStatus = await getProjectPlatformProgress(game.id, Platform.ANDROID)

    // TODO: what if they have not yet connected to apple?
    // TODO: what do do if they have credentials?
    const steps = [
      iosPlatformStatus.hasBundleSet == false && '$ shipthis game ios app create',
      androidPlatformStatus.hasBundleSet == false && '$ shipthis game android setup',
    ].filter(Boolean) as string[]

    render(
      <App>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>DETAILS</Text>
          <Box marginLeft={2} flexDirection="column">
            <Text>{`Name is ${game.name} `}</Text>
            <Text>{`ID is ${game.id}`}</Text>
          </Box>
        </Box>
        <StatusTable marginBottom={1} title="iOS Status" statuses={iosPlatformStatus as any} />
        <StatusTable marginBottom={1} title="Android Status" statuses={androidPlatformStatus as any} />
        <NextSteps steps={steps} />
      </App>,
    )
  }
}
