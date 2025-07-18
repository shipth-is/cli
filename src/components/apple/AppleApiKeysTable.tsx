import {Box, BoxProps, Text} from 'ink'
import Spinner from 'ink-spinner'

import {NextSteps, Table, Title} from '@cli/components/common/index.js'
import {CredentialsType, Platform} from '@cli/types'
import {canAppleApiKeyBeUsed, getAppleApiKeySummary, useAppleApiKeys, useUserCredentials} from '@cli/utils/index.js'

interface Props extends BoxProps {
  ctx: any
}

export const AppleApiKeysTable = ({ctx, ...boxProps}: Props) => {
  const {data: userCredentialsResponse} = useUserCredentials({platform: Platform.IOS, type: CredentialsType.KEY})
  const {data: keys, isLoading} = useAppleApiKeys({ctx})

  const hasUsable =
    keys && userCredentialsResponse && keys.some((key) => canAppleApiKeyBeUsed(key, userCredentialsResponse.data))

  return (
    <>
      <Box flexDirection="column" marginBottom={1} {...boxProps}>
        <Title>App Store Connect API Keys in your Apple account</Title>
        {isLoading && <Spinner type="dots" />}

        {keys && userCredentialsResponse && (
          <>
            <Box flexDirection="column" marginBottom={1} marginLeft={2}>
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
      {keys && !hasUsable && <NextSteps steps={['shipthis apple apiKey create']} />}
    </>
  )
}
