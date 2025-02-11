import React from 'react'
import {Box, Text, TextProps} from 'ink'

import {Scalar, ScalarDict} from '@cli/types'
import {Title} from './Title.js'

export interface StatusTableProps extends React.ComponentPropsWithoutRef<typeof Box> {
  title: string
  statuses: ScalarDict
  colors?: {
    [key: string]: string
  }
}

export const StatusRowLabel = ({label, width}: {label: string; width?: number}) => (
  <Box width={width || 10} marginRight={2}>
    <Text>{`${label}`}</Text>
  </Box>
)

interface StatusRowProps extends TextProps {
  label: string
  labelWidth?: number
  value: Scalar
}

export const StatusRow = ({label, labelWidth, value, ...textProps}: StatusRowProps) => {
  return (
    <Box flexDirection="row" alignItems="flex-end">
      <StatusRowLabel width={labelWidth} label={label} />
      <Text bold {...textProps}>
        {value}
      </Text>
    </Box>
  )
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

  const maxLabelLength = Math.max(...Object.keys(statuses).map((key) => key.length))
  const labelWidth = Math.max(maxLabelLength, 10)

  return (
    <Box flexDirection="column" {...rest}>
      <Title>{title}</Title>
      <Box flexDirection="column" marginLeft={2}>
        {Object.entries(statuses).map(([key, value]) => (
          <StatusRow labelWidth={labelWidth} key={key} label={key} value={getText(key)} color={getColor(key)} />
        ))}
      </Box>
    </Box>
  )
}
