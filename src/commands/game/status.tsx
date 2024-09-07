import {render, Box, Text} from 'ink'
import {Container, NextSteps, StatusTable} from '@cli/components/index.js'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getProject} from '@cli/api/index.js'
import {Platform} from '@cli/types.js'

export default class GameStatus extends BaseGameCommand<typeof GameStatus> {
  static override args = {}

  static override description = 'Shows the current Game status'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  // Determines how much of the configuration for the platform has been done
  private async getPercent(platform: Platform): Promise<number> {
    // TODO
    return 0
  }

  public async run(): Promise<void> {
    const {project} = await this.getProjectConfig()
    if (!project) throw new Error('No project')

    const refreshedProject = await getProject(project.id)

    const statusProps = {
      title: 'Game Status',
      statuses: {},
    }

    const steps: string[] = []

    render(
      <Container>
        <Box flexDirection="column" marginBottom={1}>
          <Text bold>GAME DETAILS</Text>
          <Box marginLeft={2} flexDirection="column">
            <Text>{`Name is ${refreshedProject.name} `}</Text>
            <Text>{`ID is ${refreshedProject.id}`}</Text>
          </Box>
        </Box>
        <StatusTable {...statusProps} />
        <NextSteps steps={steps} />
      </Container>,
    )
  }
}
