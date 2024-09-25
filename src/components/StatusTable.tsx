import React from 'react'
import {Box, Text} from 'ink'

import {ScalarDict} from '@cli/types.js'
import {Title} from './Title.js'

export interface StatusTableProps extends React.ComponentPropsWithoutRef<typeof Box> {
  title: string
  statuses: ScalarDict
  colors?: {
    [key: string]: string
  }
}

export const StatusTable = ({title, statuses, colors, ...rest}: StatusTableProps) => {
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

  // convert from dromedary case to a human readable label
  // This seems to do nothing to non-dromedary case strings??
  // TODO: this is a hack
  const getLabel = (key: string) => {
    const words = key.split(/(?=[A-Z])/)
    return words
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ')
      .replaceAll('  ', ' ')
  }

  return (
    <Box flexDirection="column" {...rest}>
      <Title>{title}</Title>
      <Box flexDirection="column" marginLeft={2}>
        <Box flexDirection="row">
          <Box flexDirection="column">
            {Object.entries(statuses).map(([key]) => (
              <Box key={key} flexDirection="row">
                <Text>{getLabel(key)}</Text>
              </Box>
            ))}
          </Box>
          <Box width={50} flexDirection="column" alignItems="flex-end">
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
