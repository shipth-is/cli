import {Box, BoxProps, Text} from 'ink'
import Spinner from 'ink-spinner'

import {CredentialsType, Platform} from '@cli/types.js'
import {
  useUserCredentials,
  getAppleCertificateSummary,
  useAppleCertificates,
  canAppleCertificateBeUsed,
} from '@cli/utils/index.js'
import {Title} from './Title.js'
import {Table} from './Table.js'

interface Props extends BoxProps {
  ctx: any
}

export const AppleCertificatesTable = ({ctx, ...boxProps}: Props) => {
  const {data: userCredentialsResponse} = useUserCredentials({
    platform: Platform.IOS,
    type: CredentialsType.CERTIFICATE,
  })
  const {data: certs, isLoading} = useAppleCertificates({ctx})

  const hasUsable =
    certs &&
    userCredentialsResponse &&
    certs.some((cert) => canAppleCertificateBeUsed(cert, userCredentialsResponse.data))

  return (
    <Box flexDirection="column" marginBottom={1} {...boxProps}>
      <Title>Distribution Certificates in your Apple account</Title>
      {isLoading && <Spinner type="dots" />}

      {certs && userCredentialsResponse && (
        <>
          <Box marginLeft={2} marginBottom={1} flexDirection="column">
            <Text>{`You have ${certs.length} Distribution Certificates in your Apple account`}</Text>
            <Text>{`${hasUsable ? 'One' : 'None'} of these can be used by shipthis`}</Text>
          </Box>
          <Table data={certs.map((cert) => getAppleCertificateSummary(cert, userCredentialsResponse.data))} />
          {!hasUsable && (
            <Box marginTop={1}>
              <Text bold>
                You do not have a usable Distribution Certificate. To ship an iOS game, you will need a usable
                Distribution Certificate.
              </Text>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
