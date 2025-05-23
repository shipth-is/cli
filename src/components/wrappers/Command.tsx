import React from 'react'
import {Box} from 'ink'
import {QueryClientProvider} from '@tanstack/react-query'

import {queryClient} from '@cli/utils/query/index.js'
import {BaseCommand} from '@cli/baseCommands/index.js'

import {CommandProvider} from '../context/index.js'
import {ScrollArea} from './ScrollArea.js'

export interface CommandProps {
  command?: BaseCommand<any>
  children: React.ReactNode
}

export const Command = ({children, command}: CommandProps) => {
  const width = process.stdout.columns || 80
  return (
    <QueryClientProvider client={queryClient}>
      <CommandProvider command={command}>
        <Box width={width} flexDirection="column">
          {children}
        </Box>
      </CommandProvider>
    </QueryClientProvider>
  )
}
