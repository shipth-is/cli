import {Box, BoxProps, Text} from 'ink'
import Spinner from 'ink-spinner'

import {CredentialsType, Platform} from '@cli/types'
import {useUserCredentials, getAppleApiKeySummary, useAppleApiKeys, canAppleApiKeyBeUsed} from '@cli/utils/index.js'
import {Title} from './Title.js'
import {Table} from './Table.js'

interface Props extends BoxProps {
  ctx: any
}

export const AppleApiKeysTable = ({ctx, ...boxProps}: Props) => {
  const {data: userCredentialsResponse} = useUserCredentials({platform: Platform.IOS, type: CredentialsType.KEY})
  const {data: keys, isLoading} = useAppleApiKeys({ctx})

  const hasUsable =
    keys && userCredentialsResponse && keys.some((key) => canAppleApiKeyBeUsed(key, userCredentialsResponse.data))

  return (
    <Box flexDirection="column" marginBottom={1} {...boxProps}>
      <Title>App Store Connect API Keys in your Apple account</Title>
      {isLoading && <Spinner type="dots" />}

      {keys && userCredentialsResponse && (
        <>
          <Box marginLeft={2} marginBottom={1} flexDirection="column">
            <Text>{`You have ${keys.length} App Store Connect API Keys in your Apple account`}</Text>
            <Text>{`${hasUsable ? 'One' : 'None'} of these can be used by ShipThis`}</Text>
          </Box>
          {keys.length > 0 && (
            <Table data={keys.map((key) => getAppleApiKeySummary(key, userCredentialsResponse.data))} />
          )}
          {!hasUsable && (
            <Box marginTop={1}>
              <Text bold>
                You do not have a usable App Store Connect API Key. To ship an iOS game, you will need a usable App
                Store Connect API Key.
              </Text>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
