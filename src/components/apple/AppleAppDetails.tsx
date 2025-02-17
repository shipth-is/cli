import {Box} from 'ink'
import Spinner from 'ink-spinner'

import {AppleAppQueryProps, useAppleApp} from '@cli/utils/query/index.js'
import {Title, Table} from '@cli/components/common/index.js'

export const AppleAppDetails = (props: AppleAppQueryProps) => {
  const {data, isLoading} = useAppleApp(props)

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Title>App Details (in the Apple Developer Portal)</Title>
      {isLoading && <Spinner type="dots" />}
      {data && data.summary && <Table data={[data.summary]} />}
    </Box>
  )
}
