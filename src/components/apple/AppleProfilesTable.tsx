import {Box, BoxProps, Text} from 'ink'
import Spinner from 'ink-spinner'

import {CredentialsType, Platform, Project} from '@cli/types'
import {
  useProjectCredentials,
  getAppleProfileSummary,
  useAppleProfiles,
  canAppleProfileBeUsed,
} from '@cli/utils/index.js'
import {Title, Table, NextSteps} from '@cli/components/common/index.js'

interface Props extends BoxProps {
  ctx: any
  project: Project
}

export const AppleProfilesTable = ({ctx, project, ...boxProps}: Props) => {
  const {data: credentialsResponse} = useProjectCredentials({
    projectId: project.id,
    platform: Platform.IOS,
    type: CredentialsType.CERTIFICATE,
  })
  const {data: profiles, isLoading} = useAppleProfiles({ctx})

  const hasUsable =
    profiles &&
    credentialsResponse &&
    profiles.some((cert) => canAppleProfileBeUsed(cert, project, credentialsResponse.data))

  return (
    <Box flexDirection="column" marginBottom={1} {...boxProps}>
      <Title>Mobile Provisioning Profiles in your Apple account</Title>
      {isLoading && <Spinner type="dots" />}

      {profiles && credentialsResponse && (
        <>
          <Box marginLeft={2} marginBottom={1} flexDirection="column">
            <Text>{`You have ${profiles.length} Mobile Provisioning Profiles in your Apple account`}</Text>
            <Text>{`${hasUsable ? 'One' : 'None'} of these can be used by ShipThis`}</Text>
          </Box>
          {profiles.length > 0 && (
            <Table data={profiles.map((cert) => getAppleProfileSummary(cert, project, credentialsResponse.data))} />
          )}
          {!hasUsable && (
            <Box marginTop={1}>
              <Text bold>
                You do not have a usable Mobile Provisioning Profile. To ship an iOS game, you will need a usable Mobile
                Provisioning Profile.
              </Text>
            </Box>
          )}
        </>
      )}
      {profiles && !hasUsable && <NextSteps steps={['shipthis game ios profile create']} />}
    </Box>
  )
}
