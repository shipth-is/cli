import {Box, Text} from 'ink'

import {API_URL} from '@cli/config.js'

export const Environment = () => {
  const {NODE_ENV} = process.env

  if (NODE_ENV === 'production') return null

  return (
    <Box marginTop={1} flexDirection="column">
      <Text bold>ENVIRONMENT</Text>
      <Box marginLeft={2} flexDirection="column">
        <Text>{`NODE_ENV is ${NODE_ENV}`}</Text>
        <Text>{`API_URL is ${API_URL}`}</Text>
      </Box>
    </Box>
  )
}
