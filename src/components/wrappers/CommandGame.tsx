import React from 'react'

import { BaseAuthenticatedCommand } from '@cli/baseCommands/baseAuthenticatedCommand.js'
import {BaseGameCommand} from '@cli/baseCommands/baseGameCommand.js'

import {GameProvider} from '../context/index.js'

import {Command, CommandProps} from './Command.js'


interface Props extends CommandProps {
  command: BaseAuthenticatedCommand<any>
}

export const CommandGame = ({children, command}: Props) => (
    <Command command={command}>
      <GameProvider>{children}</GameProvider>
    </Command>
  )
