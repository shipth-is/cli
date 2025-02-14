import {useContext, useState} from 'react'
import {Box} from 'ink'
import Spinner from 'ink-spinner'

import {useInviteServiceAccount} from '@cli/utils/index.js'
import {GameContext} from '@cli/components/context/GameProvider.js'
import {StepProps} from '@cli/components/index.js'

import {InviteForm} from './InviteForm.js'

export const InviteServiceAccount = (props: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)
  return <>{gameId && <Invite gameId={gameId} {...props} />}</>
}

interface Props extends StepProps {
  gameId: string
}

const Invite = ({onComplete, onError, gameId, ...boxProps}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inviteMutation = useInviteServiceAccount()

  const handleSubmit = async (developerId: string) => {
    try {
      setIsSubmitting(true)
      await inviteMutation.mutateAsync({projectId: gameId, developerId})
      onComplete()
    } catch (error: any) {
      onError(error)
    }
  }

  return (
    <>
      <Box flexDirection="column" gap={1} {...boxProps}>
        {isSubmitting && <Spinner type="dots" />}
        {!isSubmitting && <InviteForm onSubmit={handleSubmit} />}
      </Box>
    </>
  )
}
