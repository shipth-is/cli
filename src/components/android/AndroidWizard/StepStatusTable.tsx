import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'

import {Step, StepStatus, Steps} from './utils.js'

const StepLabels: Record<Step, string> = {
  connectGoogle: 'Connect ShipThis with Google',
  createGame: 'Create game in ShipThis',
  createGooglePlayGame: 'Create the game in Google Play',
  createInitialBuild: 'Create an initial build',
  createKeystore: 'Create or import an Android Keystore',
  createServiceAccount: 'Create a Service Account & API Key',
  inviteServiceAccount: 'Invite the Service Account',
}

interface StepWithStatusProps {
  position: number
  status: StepStatus
  title: string
}

const StepWithStatus = ({position, status, title}: StepWithStatusProps) => {
  // TODO: This is a bit of a hack, but it works for now
  const indicator = {
    [StepStatus.FAILURE]: '❌', // this is 2 wide?
    [StepStatus.PENDING]: '  ', // double space
    [StepStatus.RUNNING]: (
      <>
        {/* another double space */}
        <Spinner type="dots" />{' '}
      </>
    ),
    [StepStatus.SUCCESS]: '✅', // this is 2 wide?
    [StepStatus.WARN]: '⚠️ ', // double
  }[status]
  const isBold = status !== StepStatus.PENDING
  return (
    <Text bold={isBold}>
      <>{indicator}</> {position}. {title}
    </Text>
  )
}

interface StepStatusTableProps {
  stepStatuses: StepStatus[]
}

export const StepStatusTable = ({stepStatuses}: StepStatusTableProps) => (
    <Box flexDirection="column" marginLeft={1}>
      {Steps.map((step, index) => <StepWithStatus key={step} position={index + 1} status={stepStatuses[index]} title={StepLabels[step]} />)}
    </Box>
  )
