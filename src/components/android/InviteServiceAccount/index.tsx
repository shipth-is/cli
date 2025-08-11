import {Box} from 'ink'
import Spinner from 'ink-spinner'
import {useContext} from 'react'

import {GameContext, Markdown, StepProps} from '@cli/components/index.js'
import {WEB_URL} from '@cli/constants/config.js'
import {useInviteServiceAccount} from '@cli/utils/index.js'

import {InviteForm} from './InviteForm.js'

export const InviteServiceAccount = ({onComplete, onError, ...boxProps}: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)
  const inviteMutation = useInviteServiceAccount()

  const handleSubmit = async (developerId: string) => {
    try {
      if (!gameId) return
      await inviteMutation.mutateAsync({developerId, projectId: gameId})
      onComplete()
    } catch (error: any) {
      onError(error)
    }
  }

  const templateVars = {
    guideURL: new URL('/docs/guides/google-play-account-id', WEB_URL).toString(),
  }

  return (
    <>
      <Box flexDirection="column" gap={1} {...boxProps}>
        <Markdown filename="invite-service-account.md.ejs" templateVars={templateVars} />
        <Box>
          {inviteMutation.isPending && <Spinner type="dots" />}
          {!inviteMutation.isPending && <InviteForm onSubmit={handleSubmit} />}
        </Box>
      </Box>
    </>
  )
}
