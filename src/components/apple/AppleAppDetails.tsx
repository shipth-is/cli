import {Box} from 'ink'
import Spinner from 'ink-spinner'

import {ErrorBox, Table, Title} from '@cli/components/common/index.js'
import {toAppleHandledError} from '@cli/utils/index.js'
import {AppleAppQueryProps, useAppleApp} from '@cli/utils/query/index.js'

export const AppleAppDetails = (props: AppleAppQueryProps) => {
  const {data, error, isLoading} = useAppleApp(props)

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Title>App Details (in the Apple Developer Portal)</Title>
      {isLoading && <Spinner type="dots" />}
      {error && <ErrorBox error={toAppleHandledError(error)} />}
      {data && data.summary && <Table data={[data.summary]} />}
    </Box>
  )
}
