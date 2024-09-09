import {render, Box, Text} from 'ink'
import {Container, NextSteps, StatusTable} from '@cli/components/index.js'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProject} from '@cli/api/index.js'
import {Platform, Project} from '@cli/types.js'
import {getProjectCredentials, ProjectCredential} from '@cli/api/credentials/index.js'

export default class GameStatus extends BaseGameCommand<typeof GameStatus> {
  static override args = {}

  static override description = 'Shows the current Game status'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  // Determines how much of the configuration for the platform has been done
  private async getSetupPercent(
    platform: Platform,
    project: Project,
    projectCredentials: ProjectCredential[],
  ): Promise<number> {
    /* 
    // Assumes only 2 platforms
    const hasBundleSet =
      platform == Platform.IOS ? !!project.details?.iosBundleId : !!project.details?.androidPackageName;
    
    
    const hasCredentialsForPlatform = projectCredentials.some(
      (c) => c.platform == platform,
    ) */
  }

  public async run(): Promise<void> {
    const {project: configProject} = await this.getProjectConfig()
    if (!configProject) throw new Error('No project')

    const project = await getProject(configProject.id)

    const projectCredentials = await getProjectCredentials(project.id)

    const statusProps = {
      title: 'GAME STATUS',
      statuses: {},
    }

    const steps: string[] = []

    render(
      <Container>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>GAME DETAILS</Text>
          <Box marginLeft={2} flexDirection="column">
            <Text>{`Name is ${project.name} `}</Text>
            <Text>{`ID is ${project.id}`}</Text>
          </Box>
        </Box>
        <StatusTable {...statusProps} />
        <NextSteps steps={steps} />
      </Container>,
    )
  }
}
