import {Box, BoxProps, Text} from 'ink'
import Spinner from 'ink-spinner'

import {getBuildSummary, BuildsQueryProps, useBuilds} from '@cli/utils/index.js'
import {Table} from './common/Table.js'
import {Title} from './common/Title.js'

interface Props extends BoxProps {
  queryProps: BuildsQueryProps
}

export const BuildsTable = ({queryProps, ...boxProps}: Props) => {
  const {isLoading, data} = useBuilds(queryProps)

  return (
    <Box flexDirection="column" marginBottom={1} {...boxProps}>
      <Title>{`Builds uploaded to ShipThis from completed jobs for this game.`}</Title>
      {isLoading && <Spinner type="dots" />}
      {data && <Table data={data.data.map(getBuildSummary)} />}
      {data && data.pageCount > 1 && (
        <Box marginTop={1} flexDirection="column">
          <Text>{`Showing page ${(queryProps.pageNumber || 0) + 1} of ${data.pageCount}.`}</Text>
          <Text>Use the --pageNumber parameter to see other pages.</Text>
        </Box>
      )}
    </Box>
  )
}
