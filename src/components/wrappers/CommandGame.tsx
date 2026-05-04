import {Box, Text} from 'ink'
import React from 'react'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/baseAuthenticatedCommand.js'
import {GameContext, GameProvider} from '@cli/components/context/GameProvider.js'
import {HandledError} from '@cli/types/index.js'

import {Command, CommandProps} from './Command.js'

interface Props extends CommandProps {
  command: BaseAuthenticatedCommand<any>
}

const CommandGameErrorBoundary = ({children}: {children: React.ReactNode}) => {
  const {error} = React.useContext(GameContext)

  // No error
  if (!error) return <>{children}</>

  // An preformatted error - don't show the stack
  if (error instanceof HandledError) {
    return (
      <Box flexDirection="row" marginTop={0}>
        <Text color="red">{' ›   '}</Text>
        <Text>Error: {error.message}</Text>
      </Box>
    )
  }

  // Show full error and stack if there is one
  const fullLog = error.stack?.includes(error.message) ? error.stack : `${error.message}\n${error.stack}`
  return (
    <Box flexDirection="column" marginTop={0}>
      {fullLog.split('\n').map((line, i) => (
        <Text key={i} color="red">
          {line}
        </Text>
      ))}
    </Box>
  )
}

export const CommandGame = ({children, command}: Props) => (
  <Command command={command}>
    <GameProvider>
      <CommandGameErrorBoundary>{children}</CommandGameErrorBoundary>
    </GameProvider>
  </Command>
)
