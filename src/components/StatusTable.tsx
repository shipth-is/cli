import React from 'react'
import {Box, Text} from 'ink'

export interface StatusTableProps {
  title: string
  statuses: {
    [key: string]: string | boolean
  }
  colors?: {
    [key: string]: string
  }
}

export const StatusTable = ({title, statuses, colors}: StatusTableProps) => {
  const getColor = (key: string) => {
    const value = statuses[key]
    if (typeof value === 'boolean') return value ? 'green' : 'red'
    const defaultColor = 'green'
    const color = colors?.[key]
    return color || defaultColor
  }

  const getText = (key: string) => {
    const value = statuses[key]
    if (typeof value === 'boolean') return value ? 'YES' : 'NO'
    return value
  }

  return (
    <Box flexDirection="column">
      <Text bold>{title.toUpperCase()}</Text>
      <Box flexDirection="column" marginLeft={2}>
        <Box flexDirection="row">
          <Box flexDirection="column">
            {Object.entries(statuses).map(([key]) => (
              <Box key={key} flexDirection="row">
                <Text color="#ffffff">{key}</Text>
              </Box>
            ))}
          </Box>
          <Box width={20} flexDirection="column" alignItems="flex-end">
            {Object.entries(statuses).map(([key]) => (
              <Box key={key} flexDirection="row">
                <Text color={getColor(key)}>{getText(key)}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
