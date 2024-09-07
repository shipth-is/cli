import React from 'react'
import {Box} from 'ink'

export const Container = ({children}: {children: React.ReactNode}) => {
  return (
    <Box width={80} flexDirection="column">
      {children}
    </Box>
  )
}
