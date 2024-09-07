import React from 'react'
import {Box, Text} from 'ink'

export interface StatusTableProps {
  title: string
  statuses: {
    [key: string]: string
  }
  colors?: {
    [key: string]: string
  }
}

export const StatusTable = ({title, statuses, colors}: StatusTableProps) => {
  const getColor = (key: string) => {
    const defaultColor = 'white'
    const color = colors?.[key]
    return color || defaultColor
  }

  return (
    <Box flexDirection="column">
      <Box margin={2} borderStyle="single">
        <Text color="green">{title}</Text>
      </Box>
      {Object.entries(statuses).map(([key, value]) => (
        <Box key={key} flexDirection="row">
          <Text>{key}</Text>
          <Text color={getColor(key)}>{value}</Text>
        </Box>
      ))}
      <Text color="green">I am green</Text>
      <Text color="black" backgroundColor="white">
        I am black on white
      </Text>
      <Box flexDirection="column">
        <Text color="#ffffff">I am white</Text>
        <Text bold>I am bold</Text>
        <Text italic>I am italic</Text>
        <Text underline>I am underline</Text>
        <Text strikethrough>I am strikethrough</Text>
        <Text inverse>I am inversed</Text>
      </Box>
    </Box>
  )
}
