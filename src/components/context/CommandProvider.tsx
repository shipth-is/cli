import {BaseCommand} from '@cli/baseCommands/index.js'
import React, {useState} from 'react'

export type CommandContextType = {
  command: BaseCommand<any> | null
  setCommand: (command: BaseCommand<any>) => void
}

export const CommandContext = React.createContext<CommandContextType>({
  command: null,
  setCommand(command: BaseCommand<any>) {},
})

interface Props {
  children: React.ReactNode
  command?: BaseCommand<any>
}

export const CommandProvider = (props: Props) => {
  const [command, setCommand] = useState<BaseCommand<any> | null>(props.command || null)
  return <CommandContext.Provider value={{command, setCommand}}>{props.children}</CommandContext.Provider>
}
