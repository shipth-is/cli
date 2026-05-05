import React from 'react'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/baseAuthenticatedCommand.js'
import {ErrorBox} from '@cli/components/common/ErrorBox.js'
import {GameContext, GameProvider} from '@cli/components/context/GameProvider.js'

import {Command, CommandProps} from './Command.js'

interface Props extends CommandProps {
  command: BaseAuthenticatedCommand<any>
}

const CommandGameErrorBoundary = ({children}: {children: React.ReactNode}) => {
  const {error} = React.useContext(GameContext)
  // No error - show children
  if (!error) return <>{children}</>
  // Show error box if there is an error
  return <ErrorBox error={error} />
}

export const CommandGame = ({children, command}: Props) => (
  <Command command={command}>
    <GameProvider>
      <CommandGameErrorBoundary>{children}</CommandGameErrorBoundary>
    </GameProvider>
  </Command>
)
