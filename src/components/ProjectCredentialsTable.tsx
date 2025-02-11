import {Box, BoxProps, Text} from 'ink'
import Spinner from 'ink-spinner'

import {getProjectCredentialSummary, ProjectCredentialsQueryProps, useProjectCredentials} from '@cli/utils/index.js'
import {Table} from './common/Table.js'
import {Title} from './common/Title.js'

interface Props extends BoxProps {
  credentialTypeName: string
  queryProps: ProjectCredentialsQueryProps
}

export const ProjectCredentialsTable = ({credentialTypeName, queryProps, ...boxProps}: Props) => {
  const {isLoading, data} = useProjectCredentials(queryProps)

  const hasActive = data?.data.some((credential) => credential.isActive)

  return (
    <Box flexDirection="column" marginBottom={1} {...boxProps}>
      <Title>{`${credentialTypeName}s in your ShipThis account`}</Title>
      <Box marginLeft={2} marginBottom={1} flexDirection="column">
        <Text>
          {hasActive
            ? `You have an active ${credentialTypeName} in your ShipThis account.`
            : `You DO NOT have an active ${credentialTypeName} which ShipThis can use.`}
        </Text>
      </Box>
      {isLoading && <Spinner type="dots" />}
      {data && data.data.length > 0 && <Table data={data.data.map(getProjectCredentialSummary)} />}
    </Box>
  )
}
