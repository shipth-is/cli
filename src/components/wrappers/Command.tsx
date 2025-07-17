import {QueryClientProvider} from '@tanstack/react-query'
import {useScreenSize} from 'fullscreen-ink'
import {Box} from 'ink'
import React from 'react'

import {BaseCommand} from '@cli/baseCommands/index.js'
import {queryClient} from '@cli/utils/query/index.js'

import {CommandProvider} from '../context/index.js'

export interface CommandProps {
  children: React.ReactNode
  command?: BaseCommand<any>
}

export const Command = ({children, command}: CommandProps) => {
  const {width} = useScreenSize()

  return (
    <QueryClientProvider client={queryClient}>
      <CommandProvider command={command}>
        <Box flexDirection="column" width={width}>
          {children}
        </Box>
      </CommandProvider>
    </QueryClientProvider>
  )
}
