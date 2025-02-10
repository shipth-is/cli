import React from 'react'
import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'

import {Step, Steps, StepStatus} from './utils.js'

const StepLabels: Record<Step, string> = {
  createGame: 'Create game in ShipThis',
  createKeystore: 'Create an Android Keystore',
  connectGoogle: 'Connect ShipThis with Google',
  createServiceAccount: 'Create a Service Account & API Key',
  createInitialBuild: 'Create an initial build',
  createGooglePlayGame: 'Create the game in Google Play',
  inviteServiceAccount: 'Invite the Service Account',
}

interface StepWithStatusProps {
  position: number
  title: string
  status: StepStatus
}

const StepWithStatus = ({position, title, status}: StepWithStatusProps) => {
  // TODO: This is a bit of a hack, but it works for now
  const indicator = {
    [StepStatus.PENDING]: '  ', // double space
    [StepStatus.RUNNING]: (
      <>
        {/* another double space */}
        <Spinner type="dots" />{' '}
      </>
    ),
    [StepStatus.SUCCESS]: '✅', // this is 2 wide?
    [StepStatus.FAILURE]: '❌', // this is 2 wide?
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

export const StepStatusTable = ({stepStatuses}: StepStatusTableProps) => {
  return (
    <Box flexDirection="column" marginLeft={1}>
      {Steps.map((step, index) => {
        return <StepWithStatus key={step} position={index + 1} title={StepLabels[step]} status={stepStatuses[index]} />
      })}
    </Box>
  )
}
