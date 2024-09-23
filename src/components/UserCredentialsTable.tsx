import {Box, BoxProps, Text} from 'ink'
import Spinner from 'ink-spinner'

import {getUserCredentialSummary, UserCredentialsQueryProps, useUserCredentials} from '@cli/utils/index.js'
import {Table} from './Table.js'
import {Title} from './Title.js'

interface Props extends BoxProps {
  credentialTypeName: string
  queryProps: UserCredentialsQueryProps
}

export const UserCredentialsTable = ({credentialTypeName, queryProps, ...boxProps}: Props) => {
  const {isLoading, data} = useUserCredentials(queryProps)

  const hasActive = data?.data.some((credential) => credential.isActive)

  return (
    <Box flexDirection="column" marginBottom={1} {...boxProps}>
      <Title>{`${credentialTypeName}s in your Shipthis account`}</Title>
      <Box marginLeft={2} marginBottom={1} flexDirection="column">
        <Text>
          {hasActive
            ? `You have an active ${credentialTypeName} in your shipthis account.`
            : `You DO NOT have an active ${credentialTypeName} which shipthis can use.`}
        </Text>
      </Box>
      {isLoading && <Spinner type="dots" />}
      {data && <Table data={data.data.map(getUserCredentialSummary)} />}
    </Box>
  )
}
