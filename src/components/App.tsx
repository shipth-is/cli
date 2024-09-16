import React from 'react'
import {Box} from 'ink'
import {QueryClientProvider} from '@tanstack/react-query'

import {queryClient} from '@cli/utils/query/index.js'

export const App = ({children}: {children: React.ReactNode}) => {
  // TODO: this is because I have a massive wide monitor.
  const width = Math.min(160, process.stdout.columns || 80)

  return (
    <QueryClientProvider client={queryClient}>
      <Box width={width} flexDirection="column">
        {children}
      </Box>
    </QueryClientProvider>
  )
}
