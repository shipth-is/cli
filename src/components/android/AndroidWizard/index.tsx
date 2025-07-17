import {Box} from 'ink'
import React, {useEffect, useState} from 'react'

import {ConnectGoogle} from '@cli/components/android/ConnectGoogle/index.js'
// Avoid circular imports here - import the components directly
import {CreateGame} from '@cli/components/android/CreateGame/index.js'
import {CreateGooglePlayGame} from '@cli/components/android/CreateGooglePlayGame/index.js'
import {CreateInitialBuild} from '@cli/components/android/CreateInitialBuild/index.js'
import {CreateServiceAccountKey} from '@cli/components/android/CreateServiceAccountKey/index.js'
import {InviteServiceAccount} from '@cli/components/android/InviteServiceAccount/index.js'
import {CreateOrImport} from '@cli/components/android/Keystore/CreateOrImport.js'
import {CommandContext, GameProvider} from '@cli/components/context/index.js'
import {Markdown, StepProps} from '@cli/components/index.js'
import {WEB_URL} from '@cli/constants/config.js'
import { useResponsive } from '@cli/utils/index.js'

import {Step, StepStatus, Steps, getStatusFlags, getStepInitialStatus} from './utils.js'
import {WizardHeader} from './WizardHeader.js'

const stepComponentMap: Record<Step, React.ComponentType<StepProps>> = {
  connectGoogle: ConnectGoogle,
  createGame: CreateGame,
  createGooglePlayGame: CreateGooglePlayGame,
  createInitialBuild: CreateInitialBuild,
  createKeystore: CreateOrImport,
  createServiceAccount: CreateServiceAccountKey,
  inviteServiceAccount: InviteServiceAccount,
}

const ON_COMPLETE_DELAY_MS = 500

export const AndroidWizard = (props: StepProps) => {
  const {command} = React.useContext(CommandContext)

  const { isTall, isWide } = useResponsive()

  const [currentStep, setCurrentStep] = useState<Step | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState<null | number>(null)
  const [stepStatuses, setStepStatuses] = useState<StepStatus[] | null>(null)

  const [showSuccess, setShowSuccess] = useState(false)

  // Returns true if all steps are complete
  const determineStep = async () => {
    if (!command) return
    const statusFlags = await getStatusFlags(command)
    const initStatuses = Steps.map((step) => getStepInitialStatus(step, statusFlags))
    // Find the first step that is PENDING
    const firstPending = initStatuses.indexOf(StepStatus.PENDING)
    const pendingStep = firstPending === -1 ? null : Steps[firstPending]
    // Set the first step to running (it will start on mount of the component for it
    const withPending: StepStatus[] = initStatuses.map((status, index) => {
      if (index === firstPending) return StepStatus.RUNNING
      return status
    })
    setCurrentStepIndex(firstPending)
    setCurrentStep(pendingStep)
    setStepStatuses(withPending)
    const isAllDone = firstPending === -1
    setShowSuccess(isAllDone)
    if (isAllDone) setTimeout(props.onComplete, ON_COMPLETE_DELAY_MS)
  }

  useEffect(() => {
    determineStep().catch(props.onError)
  }, [command])

  const handleStepComplete = () => determineStep().catch(props.onError)

  const StepInterface = currentStep ? stepComponentMap[currentStep] : null

  const templateVars = {
    docsURL: new URL('/docs', WEB_URL).toString(),
    iosSetupURL: new URL('/docs/ios', WEB_URL).toString(),
  }

  return (
    <GameProvider>
      <WizardHeader currentStepIndex={currentStepIndex} stepStatuses={stepStatuses} />
      {StepInterface && (
        <StepInterface
          borderStyle={isTall && isWide ? 'single' : undefined}
          margin={isTall && isWide ? 1 : 0}
          onComplete={handleStepComplete}
          onError={props.onError}
          padding={isTall && isWide ? 1 : 0}
        />
      )}
      {showSuccess && (
        <Box marginTop={1}>
          <Markdown filename="android-success.md" templateVars={templateVars} />
        </Box>
      )}
    </GameProvider>
  )
}
