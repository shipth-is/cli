import {Box, Text, TextProps} from 'ink'
import React from 'react'

import {Scalar, ScalarDict} from '@cli/types'

import {Title} from './Title.js'

export interface StatusTableProps extends React.ComponentPropsWithoutRef<typeof Box> {
  colors?: {
    [key: string]: string
  }
  statuses: ScalarDict
  title: string
}

export const StatusRowLabel = ({label, width}: {label: string; width?: number}) => (
  <Box marginRight={2} width={width || 10}>
    <Text>{`${label}`}</Text>
  </Box>
)

interface StatusRowProps extends TextProps {
  label: string
  labelWidth?: number
  value: Scalar
}

export const StatusRow = ({label, labelWidth, value, ...textProps}: StatusRowProps) => (
    <Box alignItems="flex-end" flexDirection="row">
      <StatusRowLabel label={label} width={labelWidth} />
      <Text bold {...textProps}>
        {value}
      </Text>
    </Box>
  )

export const StatusTable = ({colors, statuses, title, ...rest}: StatusTableProps) => {
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
          <StatusRow color={getColor(key)} key={key} label={key} labelWidth={labelWidth} value={getText(key)} />
        ))}
      </Box>
    </Box>
  )
}
