import React, {useEffect, useState} from 'react'
import {Box, Text} from 'ink'
import {Title} from '../Title.js'

import {GameInfoForm} from './GameInfoForm.js'
import {StepStatusTable} from './StepStatusTable.js'
import {BaseCommand} from '@cli/baseCommands/index.js'
import {getStatusFlags, getStepInitialStatus, Step, StepProps, Steps, StepStatus} from './utils.js'
import {EditableProject} from '@cli/types/api.js'
import {CreateGame} from './CreateGame.js'
import {CreateKeystore} from './CreateKeystore.js'
import {ConnectGoogle} from './ConnectGoogle.js'

interface Props {
  command: BaseCommand<any> // Needs the oclif command context for project dir etc
}

const stepComponentMap: Record<Step, React.ComponentType<StepProps>> = {
  gameInfo: GameInfoForm,
  createGame: CreateGame,
  createKeystore: CreateKeystore,
  connectGoogle: ConnectGoogle,
  createServiceAccount: () => <Text>TODO</Text>,
  createInitialBuild: () => <Text>TODO</Text>,
  createGooglePlayGame: () => <Text>TODO</Text>,
  inviteServiceAccount: () => <Text>TODO</Text>,
}

export const AndroidWizard = ({command}: Props) => {
  const [currentStep, setCurrentStep] = useState<Step | null>(null)
  const [stepStatuses, setStepStatuses] = useState<null | StepStatus[]>(null)

  const [gameInfo, setGameInfo] = useState<EditableProject | undefined>(undefined)

  const setInitialStatus = async () => {
    const statusFlags = await getStatusFlags(command)
    const initStatuses = Steps.map((step) => getStepInitialStatus(step, statusFlags))
    // Find the first step that is PENDING
    const firstPending = initStatuses.findIndex((status) => status === StepStatus.PENDING)
    const pendingStep = firstPending === -1 ? null : Steps[firstPending]
    setCurrentStep(pendingStep)
    // Set the first step to running (it will start on mount of the component for it
    const withPending: StepStatus[] = initStatuses.map((status, index) => {
      if (index === firstPending) return StepStatus.RUNNING
      return status
    })
    setStepStatuses(withPending)
  }

  useEffect(() => {
    setInitialStatus()
  }, [])

  const handleStepComplete = (gameInfo?: EditableProject) => {
    if (currentStep == 'gameInfo' && gameInfo) {
      // TODO; wtf is this
      setStepStatuses([
        StepStatus.SUCCESS,
        StepStatus.RUNNING,
        StepStatus.PENDING,
        StepStatus.PENDING,
        StepStatus.PENDING,
        StepStatus.PENDING,
        StepStatus.PENDING,
      ])
      setGameInfo(gameInfo)
      setCurrentStep('createGame')
      return
    }
    setInitialStatus()
  }

  const handleStepError = (error: Error) => {
    // TODO
  }

  const StepInterface = currentStep ? stepComponentMap[currentStep] : null

  return (
    <>
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Title>ShipThis Android Wizard</Title>
        </Box>
        {stepStatuses && <StepStatusTable stepStatuses={stepStatuses} />}
      </Box>
      {StepInterface && (
        <StepInterface
          gameInfo={gameInfo}
          command={command}
          onComplete={handleStepComplete}
          onError={handleStepError}
        />
      )}
    </>
  )
}
