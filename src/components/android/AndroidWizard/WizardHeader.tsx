import React from 'react'
import {Box} from 'ink'

import {Title} from '@cli/components/index.js'
import {useResponsive} from '@cli/utils/index.js'

import {StepStatusTable} from './StepStatusTable.js'
import {StepStatus} from './utils.js'

interface WizardHeaderProps {
  currentStepIndex: number | null
  stepStatuses?: StepStatus[] | null
}

// Responsive header - we hide the table and show the step X of Y on small screens
export const WizardHeader = ({currentStepIndex, stepStatuses}: WizardHeaderProps) => {
  const { isTall } = useResponsive();
  const stepCount = stepStatuses ? stepStatuses.length : 0
  const currentStep = currentStepIndex !== null ? currentStepIndex + 1 : null
  const title = isTall ? 'ShipThis Android Wizard' : `ShipThis Android Wizard (step ${currentStep} of ${stepCount})`
  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Title>{title}</Title>
      </Box>
      {stepStatuses && isTall && <StepStatusTable stepStatuses={stepStatuses} />}
    </Box>
  )
}
