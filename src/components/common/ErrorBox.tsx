import {Box, Text} from 'ink'
import React from 'react'

import {HandledError} from '@cli/types/index.js'

interface ErrorBoxProps {
  error: Error
}

export const ErrorBox = ({error}: ErrorBoxProps) => {
  // A preformatted error - don't show the stack
  if (error instanceof HandledError) {
    return (
      <Box flexDirection="row" marginTop={0}>
        <Text color="red">{' ›   '}</Text>
        <Text>Error: {error.message}</Text>
      </Box>
    )
  }

  // Show full error and stack if there is one
  const stack = error.stack?.trim()
  const fullLog =
    stack && stack.includes(error.message)
      ? stack
      : [error.message, stack].filter((part): part is string => Boolean(part)).join('\n')
  const logLines = fullLog ? fullLog.split('\n') : [error.message]

  return (
    <Box flexDirection="column" marginTop={0}>
      {logLines.map((line, i) => (
        <Text key={i} color="red">
          {line}
        </Text>
      ))}
    </Box>
  )
}