import React from 'react'

import {BaseGameCommand} from '@cli/baseCommands/baseGameCommand.js'

import {GameProvider} from '../context/index.js'

import {Command, CommandProps} from './Command.js'

import { BaseAuthenticatedCommand } from '@cli/baseCommands/baseAuthenticatedCommand.js'

interface Props extends CommandProps {
  command: BaseAuthenticatedCommand<any>
}

export const CommandGame = ({children, command}: Props) => (
    <Command command={command}>
      <GameProvider>{children}</GameProvider>
    </Command>
  )
