import {Args} from '@oclif/core'
import {render, Box, Text} from 'ink'
import axios from 'axios'
import {useContext, useEffect, useState} from 'react'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {CommandContext, CommandGame, JobProgress} from '@cli/components/index.js'
import {Job, ShipGameFlags, SimulatorSession} from '@cli/types/index.js'

import {castObjectDates} from '@cli/utils/dates.js'
import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL} from '@cli/constants/config.js'
import {getErrorMessage} from '@cli/utils/errors.js'
import {useSafeInput, useShip} from '@cli/utils/index.js'

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
  } catch (error: any) {
    console.log(JSON.stringify(error.response?.data, null, 2))
    //console.error('Error starting simulator:', error)
    throw error
  }
}

interface SimulatorBuilderProps {
  platform: 'android' | 'ios'
  onError: (error: any) => void
}

const SimulatorBuilder = ({platform, onError}: SimulatorBuilderProps): JSX.Element => {
  const {command} = useContext(CommandContext)
  const shipMutation = useShip()
  const [jobs, setJobs] = useState<Job[] | null>(null)

  const startBuild = async () => {
    if (!command) throw new Error('No command in context')
    if (shipMutation.isPending) return
    setJobs(null)
    const shipFlags: Partial<ShipGameFlags> = {platform, simulator: true}
    const startedJobs = await shipMutation.mutateAsync({
      command,
      log: () => {},
      warnLog: () => {},
      shipFlags: {...(command.getFlags() as ShipGameFlags), ...shipFlags},
    })
    setJobs(startedJobs)
  }

  useEffect(() => {
    startBuild().catch(onError)
  }, [])

  useSafeInput((input) => {
    if (input.toLowerCase() === 'r' && !shipMutation.isPending) startBuild().catch(onError)
  })

  return (
    <Box flexDirection="column">
      {shipMutation.isPending && <Text>Building... (this can take a while)</Text>}
      {!shipMutation.isPending && jobs && jobs.map((job) => <JobProgress job={job} key={job.id} />)}
      <Text>{shipMutation.isPending ? 'Build in progress...' : 'Press R to rebuild now.'}</Text>
    </Box>
  )
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

    const handleError = (e: Error) => this.error(getErrorMessage(e))

    render(
      <CommandGame command={this}>
        <Box flexDirection="column">
          <Text>Simulator session started for platform: {platform}</Text>
          <Text>Session ID: {session.id}</Text>
          <SimulatorBuilder platform={platform as 'android' | 'ios'} onError={handleError} />
        </Box>
      </CommandGame>,
    )
  }
}
