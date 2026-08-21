import {Args, Flags} from '@oclif/core'
import {render, Box, Text} from 'ink'
import {useContext, useEffect, useState} from 'react'

import {startSimulator} from '@cli/api/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {CommandContext, CommandGame, JobProgress, SimulatorSessionStatus} from '@cli/components/index.js'
import {SIMULATOR_DEFAULT_DURATION_SECONDS, SIMULATOR_MAX_DURATION_SECONDS} from '@cli/constants/index.js'
import {Job, Platform, ShipGameFlags, SimulatorSession} from '@cli/types/index.js'
import {formatDuration} from '@cli/utils/dates.js'
import {getErrorMessage} from '@cli/utils/errors.js'
import {useSafeInput, useShip} from '@cli/utils/index.js'

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
    const shipFlags: Partial<ShipGameFlags> = {platform, simulator: true, useDemoCredentials: true}
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
    // No short char: -d is used for --useDemoCredentials elsewhere in the CLI.
    maxDuration: Flags.integer({
      description: `How long the simulator session may run, in seconds (default ${SIMULATOR_DEFAULT_DURATION_SECONDS}, max ${SIMULATOR_MAX_DURATION_SECONDS})`,
      max: SIMULATOR_MAX_DURATION_SECONDS,
      min: 1,
      required: false,
    }),
  }

  static override description = 'Runs the game in a simulator for the specified platform.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> ios',
    '<%= config.bin %> <%= command.id %> android',
    '<%= config.bin %> <%= command.id %> android --gameId 0c179fc4',
    '<%= config.bin %> <%= command.id %> ios --maxDuration 1800',
  ]

  public async run(): Promise<void> {
    const gameId = this.getGameId()
    if (!gameId) {
      this.error('No game found - please run `shipthis game wizard` or specify a game ID with --gameId', {exit: 1})
    }

    const {platform} = this.args
    const {maxDuration} = this.flags

    const session = await startSimulator(gameId, `${platform}`.toUpperCase() as Platform, maxDuration).catch((e) =>
      this.error(getErrorMessage(e)),
    )

    const handleError = (e: Error) => this.error(getErrorMessage(e))

    // Shared between this method and the ink tree: the end callback fires from
    // inside the render, so it needs the unmount handle, and what it records
    // has to outlive the tree. An object rather than plain locals because
    // TypeScript narrows away values assigned inside a closure.
    const ended: {didEnd: boolean; session: null | SimulatorSession; unmount?: () => void} = {
      didEnd: false,
      session: null,
    }

    // We print the closing line after ink has torn down: its final frame is not
    // a reliable place for it.
    const handleSessionEnded = (endedSession: null | SimulatorSession) => {
      ended.didEnd = true
      ended.session = endedSession
      if (ended.unmount) ended.unmount()
    }

    const instance = render(
      <CommandGame command={this}>
        <Box flexDirection="column">
          <SimulatorSessionStatus
            initialSession={session}
            onSessionEnded={handleSessionEnded}
            requestedMaxDuration={maxDuration}
          />
          <SimulatorBuilder platform={platform as 'android' | 'ios'} onError={handleError} />
        </Box>
      </CommandGame>,
    )

    ended.unmount = instance.unmount
    // The session can already be over by the time render() returns.
    if (ended.didEnd) instance.unmount()

    await instance.waitUntilExit()

    if (ended.didEnd) {
      const limit = ended.session?.maxDurationSeconds ?? session.maxDurationSeconds
      const limitText = limit ? ` (${formatDuration(limit)} limit)` : ''
      this.log(`Simulator session ended${limitText}.`)
    }
  }
}
