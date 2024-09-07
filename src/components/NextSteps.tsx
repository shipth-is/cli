import React from 'react'
import {Box, Text} from 'ink'

export interface NextStepsProps {
  steps: string[]
}

export const NextSteps = ({steps}: NextStepsProps) => {
  if (steps.length === 0) return null
  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold>NEXT STEPS</Text>
      <Box flexDirection="column" marginLeft={2}>
        {steps.map((step, index) => (
          <Text key={index}>{step}</Text>
        ))}
      </Box>
    </Box>
  )
}
