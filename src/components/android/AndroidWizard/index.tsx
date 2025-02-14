import React, {useEffect, useState} from 'react'
import {Box} from 'ink'

import {StepProps, Title} from '@cli/components/index.js'
import {CommandContext, GameProvider} from '@cli/components/context/index.js'

// Avoid circular imports here - import the components directly
import {CreateGame} from '@cli/components/android/CreateGame/index.js'
import {CreateKeystore} from '@cli/components/android/CreateKeystore.js'
import {ConnectGoogle} from '@cli/components/android/ConnectGoogle/index.js'
import {CreateServiceAccountKey} from '@cli/components/android/CreateServiceAccountKey/index.js'
import {CreateInitialBuild} from '@cli/components/android/CreateInitialBuild/index.js'
import {CreateGooglePlayGame} from '@cli/components/android/CreateGooglePlayGame.js'
import {InviteServiceAccount} from '@cli/components/android/InviteServiceAccount/index.js'

import {StepStatusTable} from './StepStatusTable.js'
import {getStatusFlags, getStepInitialStatus, Step, Steps, StepStatus} from './utils.js'

const stepComponentMap: Record<Step, React.ComponentType<StepProps>> = {
  createGame: CreateGame,
  createKeystore: CreateKeystore,
  connectGoogle: ConnectGoogle,
  createServiceAccount: CreateServiceAccountKey,
  createInitialBuild: CreateInitialBuild,
  createGooglePlayGame: CreateGooglePlayGame,
  inviteServiceAccount: InviteServiceAccount,
}

export const AndroidWizard = (props: StepProps) => {
  const {command} = React.useContext(CommandContext)

  const [currentStep, setCurrentStep] = useState<Step | null>(null)
  const [stepStatuses, setStepStatuses] = useState<null | StepStatus[]>(null)

  // Returns true if all steps are complete
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
    return firstPending === -1
  }

  useEffect(() => {
    determineStep().then((isAllDone) => {
      if (isAllDone) props.onComplete()
    })
  }, [command])

  const handleStepComplete = async () => {
    const isAllDone = await determineStep()
    if (isAllDone) props.onComplete()
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
      {StepInterface && (
        <StepInterface
          onComplete={handleStepComplete}
          onError={props.onError}
          margin={1}
          borderStyle="single"
          padding={1}
        />
      )}
    </GameProvider>
  )
}
