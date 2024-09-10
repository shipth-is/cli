import {render, Box, Text} from 'ink'
import {Container, NextSteps, StatusTable} from '@cli/components/index.js'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProject, getProjectPlatformProgress} from '@cli/api/index.js'
import {Platform} from '@cli/types.js'

export default class GameStatus extends BaseGameCommand<typeof GameStatus> {
  static override args = {}

  static override description = 'Shows the current Game status'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const {project: configProject} = await this.getProjectConfig()
    if (!configProject) throw new Error('No project')

    const project = await getProject(configProject.id)

    const iosPlatformStatus = await getProjectPlatformProgress(project.id, Platform.IOS)
    const androidPlatformStatus = await getProjectPlatformProgress(project.id, Platform.ANDROID)

    // TODO: what if they have not yet connected to apple?
    // TODO: what do do if they have credentials?
    const steps = [
      iosPlatformStatus.hasBundleSet == false && '$ shipthis game ios app create',
      androidPlatformStatus.hasBundleSet == false && '$ shipthis game android setup',
    ].filter(Boolean) as string[]

    render(
      <Container>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>DETAILS</Text>
          <Box marginLeft={2} flexDirection="column">
            <Text>{`Name is ${project.name} `}</Text>
            <Text>{`ID is ${project.id}`}</Text>
          </Box>
        </Box>
        <StatusTable marginBottom={1} title="iOS Status" statuses={iosPlatformStatus as any} />
        <StatusTable marginBottom={1} title="Android Status" statuses={androidPlatformStatus as any} />
        <NextSteps steps={steps} />
      </Container>,
    )
  }
}
