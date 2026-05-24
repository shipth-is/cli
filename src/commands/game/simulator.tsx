import {Args} from '@oclif/core'
import {render} from 'ink'
import {Text} from 'ink'
import axios from 'axios'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {CommandGame} from '@cli/components/index.js'
import {SimulatorSession} from '@cli/types/api.js'

import {castObjectDates} from '@cli/utils/dates.js'
import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL} from '@cli/constants/config.js'

async function startSimulator(projectId: string, platform: string): Promise<SimulatorSession> {
  const headers = getAuthedHeaders()
  const opt = {headers}

  try {
    const {data} = await axios.post(
      `${API_URL}/simulator/start`,
      {platform: `${platform}`.toUpperCase(), projectId},
      opt,
    )
    return castObjectDates<SimulatorSession>(data)
  } catch (error) {
    console.log(JSON.stringify(error.response?.data, null, 2))
    //console.error('Error starting simulator:', error)
    throw error
  }
}

export default class GameSimulator extends BaseGameCommand<typeof GameSimulator> {
  static override args = {
    platform: Args.string({
      description: 'The platform to run the simulator for. This can be "android" or "ios"',
      options: ['android', 'ios'],
      required: true,
    }),
  }

  static override flags = {
    ...BaseGameCommand.flags,
  }

  static override description = 'Runs the game in a simulator for the specified platform.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> ios',
    '<%= config.bin %> <%= command.id %> android',
    '<%= config.bin %> <%= command.id %> android --gameId 0c179fc4',
  ]

  public async run(): Promise<void> {
    const gameId = this.getGameId()
    if (!gameId) {
      this.error('No game found - please run `shipthis game wizard` or specify a game ID with --gameId', {exit: 1})
    }

    const {platform} = this.args

    const session = await startSimulator(gameId, platform)

    render(
      <CommandGame command={this}>
        <Text>Simulator skeleton for platform: {platform}</Text>
        <Text>Session ID: {session.id}</Text>
        <Text>`{JSON.stringify(session, null, 2)}`</Text>
      </CommandGame>,
    )
  }
}
