import {Box, Text} from 'ink'
import React from 'react'

import {Title} from './Title.js'

export interface ListWithTitleProps {
  listItems: string[]
  title: string
}

export const ListWithTitle = ({listItems, title}: ListWithTitleProps) => {
  if (listItems.length === 0) return null
  const header = title.toUpperCase()
  return (
    <Box flexDirection="column" marginTop={1}>
      <Title>{header}</Title>
      <Box flexDirection="column" marginLeft={2}>
        {listItems.map((listItem, index) => (
          <Text key={index}>{listItem}</Text>
        ))}
      </Box>
    </Box>
  )
}
