import React from 'react'

import {GameProvider} from '../context/index.js'
import {Command, CommandProps} from './Command.js'
import {BaseGameCommand} from '@cli/baseCommands/baseGameCommand.js'

interface Props extends CommandProps {
  command: BaseGameCommand<any>
}

export const CommandGame = ({children, command}: Props) => {
  return (
    <Command command={command}>
      <GameProvider>{children}</GameProvider>
    </Command>
  )
}
