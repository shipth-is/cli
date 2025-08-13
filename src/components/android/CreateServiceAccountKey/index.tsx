import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import {useContext, useEffect, useRef, useState} from 'react'

import {GameContext, Markdown, ProgressSpinner, StepProps} from '@cli/components/index.js'
import {
  getShortDate,
  useAndroidServiceAccount,
  useGoogleStatus,
  useSafeInput,
  useUpdateGoogleOrgPolicy,
} from '@cli/utils/index.js'

// The hook needs the gameId so we have a little wrapper
export const CreateServiceAccountKey = (props: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)
  return <>{gameId && <CreateForGame gameId={gameId} {...props} />}</>
}

interface CreateForGameProps extends StepProps {
  gameId: string
}

const CreateForGame = ({gameId, onComplete, onError, ...boxProps}: CreateForGameProps) => {
  const [didStart, setDidStart] = useState(false)
  const startedRef = useRef(false)

  const {data: googleStatus} = useGoogleStatus()
  const updatePolicyMutation = useUpdateGoogleOrgPolicy()

  const {handleStart, isCreating, setupStatus} = useAndroidServiceAccount({
    onComplete,
    onError,
    projectId: gameId,
  })

  useEffect(() => {
    if (startedRef.current) return
    if (!googleStatus) return
    if (!googleStatus.needsPolicyChange) {
      startedRef.current = true
      // If no policy change is needed, we can start the process
      handleStart().then(() => setDidStart(true)).catch((error) => onError(error));
    }
  }, [googleStatus])

  useSafeInput((input) => {
    if (input === 'p' && googleStatus?.needsPolicyChange && !updatePolicyMutation.isPending) {
      // Trigger policy change
      updatePolicyMutation.mutate({action: 'revoke'})
    }
  })

  const needsPolicy = Boolean(googleStatus?.needsPolicyChange)
  const policyChanging = updatePolicyMutation.isPending || (updatePolicyMutation.isSuccess && needsPolicy)

  const Header = () => (
    <Box flexDirection="row" gap={1}>
      <Text>Creating a Service Account and API Key...</Text>
      {isCreating && <Spinner type="dots" />}
    </Box>
  )

  return (
    <>
      <Box flexDirection="column" gap={1} {...boxProps}>
        {needsPolicy ? (
          policyChanging ? (
            <Box flexDirection="row" gap={1}>
              <Text>Updating organization policy...</Text>
              <Spinner type="dots" />
            </Box>
          ) : (
            googleStatus && (
              <Markdown
                filename="service-account-policy-wizard.md.ejs"
                templateVars={{
                  needsPolicyChange: Boolean(googleStatus.needsPolicyChange),
                  orgCreatedAt: googleStatus.orgCreatedAt ? getShortDate(googleStatus.orgCreatedAt) : 'Unknown',
                  orgName: `${googleStatus.orgName}`,
                  orgResourceName: `${googleStatus.orgResourceName}`,
                }}
              />
            )
          )
        ) : (
          <Header />
        )}

        {didStart && (
          <>
            <ProgressSpinner progress={(setupStatus?.progress || 0) * 100} spinnerType="dots" />
          </>
        )}
      </Box>
    </>
  )
}
