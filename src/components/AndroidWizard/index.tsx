import React, {useEffect, useState} from 'react'
import {Box, Text} from 'ink'
import {Title} from '../Title.js'

import {StepStatusTable} from './StepStatusTable.js'
import {BaseCommand} from '@cli/baseCommands/index.js'
import {getStatusFlags, getStepInitialStatus, Step, StepProps, Steps, StepStatus} from './utils.js'

import {CreateGame} from './CreateGame/index.js'
import {CreateKeystore} from './CreateKeystore.js'
import {ConnectGoogle} from './ConnectGoogle/index.js'
import {CommandContext, GameContext, GameProvider} from '../context/index.js'

const stepComponentMap: Record<Step, React.ComponentType<StepProps>> = {
  createGame: CreateGame,
  createKeystore: CreateKeystore,
  connectGoogle: ConnectGoogle,
  createServiceAccount: () => <Text>TODO</Text>,
  createInitialBuild: () => <Text>TODO</Text>,
  createGooglePlayGame: () => <Text>TODO</Text>,
  inviteServiceAccount: () => <Text>TODO</Text>,
}

export const AndroidWizard = () => {
  const {command} = React.useContext(CommandContext)
  const {setGameId, setGame} = React.useContext(GameContext)

  const [currentStep, setCurrentStep] = useState<Step | null>(null)
  const [stepStatuses, setStepStatuses] = useState<null | StepStatus[]>(null)

  const determineStep = async () => {
    if (!command) return
    const statusFlags = await getStatusFlags(command)
    const initStatuses = Steps.map((step) => getStepInitialStatus(step, statusFlags))
    // Find the first step that is PENDING
    const firstPending = initStatuses.findIndex((status) => status === StepStatus.PENDING)
    const pendingStep = firstPending === -1 ? null : Steps[firstPending]

    // Set the first step to running (it will start on mount of the component for it
    const withPending: StepStatus[] = initStatuses.map((status, index) => {
      if (index === firstPending) return StepStatus.RUNNING
      return status
    })
    setCurrentStep(pendingStep)
    setStepStatuses(withPending)
  }

  useEffect(() => {
    determineStep()
  }, [command])

  const handleStepComplete = () => {
    determineStep()
  }

  const handleStepError = (error: Error) => {
    // TODO
  }

  const StepInterface = currentStep ? stepComponentMap[currentStep] : null

  return (
    <GameProvider>
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Title>ShipThis Android Wizard</Title>
        </Box>
        {stepStatuses && <StepStatusTable stepStatuses={stepStatuses} />}
      </Box>
      {StepInterface && <StepInterface onComplete={handleStepComplete} onError={handleStepError} />}
    </GameProvider>
  )
}
