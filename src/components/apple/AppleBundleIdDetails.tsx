import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'

import {ErrorBox, Table, Title} from '@cli/components/common/index.js'
import {toAppleHandledError} from '@cli/utils/index.js'
import {AppleBundleIdQueryProps, useAppleBundleId} from '@cli/utils/query/index.js'

export const AppleBundleIdDetails = (props: AppleBundleIdQueryProps) => {
  const {data, error, isLoading} = useAppleBundleId(props)
  const {bundleIdSummary, capabilities, capabilitiesTable, shouldSyncCapabilities} = data || {}

  return (
    <>
      <Box flexDirection="column" marginBottom={1}>
        <Title>BundleId Details (in the Apple Developer Portal)</Title>
        {isLoading && <Spinner type="dots" />}
        {error && <ErrorBox error={toAppleHandledError(error)} />}
        {bundleIdSummary && <Table data={[bundleIdSummary]} />}
      </Box>
      {capabilities && (
        <Box flexDirection="column" marginBottom={1}>
          <Title>Capabilities enabled in the BundleId</Title>
          <Table
            data={capabilities.map((c) => ({capability: `${c}`}))}
          />
        </Box>
      )}
      {capabilitiesTable && (
        <Box flexDirection="column" marginBottom={1}>
          <Title>BundleId Capability Check</Title>
          <Table data={capabilitiesTable} />
        </Box>
      )}
      {shouldSyncCapabilities && (
        <Box flexDirection="column">
          <Text bold>The capabilities are out of sync with the Apple Developer Portal.</Text>
          <Text bold>Run shipthis game ios app sync</Text>
        </Box>
      )}
    </>
  )
}
