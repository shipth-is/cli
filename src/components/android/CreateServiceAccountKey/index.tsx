import {Box, Text} from 'ink'
import {useContext, useEffect, useState} from 'react'
import Spinner from 'ink-spinner'

import {GameContext, ProgressSpinner, StepProps} from '@cli/components/index.js'
import {useAndroidServiceAccount} from '@cli/utils/index.js'

import {SetupStatusTable} from './SetupStatusTable.js'

// The hook needs the gameId so we have a little wrapper
export const CreateServiceAccountKey = (props: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)
  return <>{gameId && <CreateForGame gameId={gameId} {...props} />}</>
}

interface CreateForGameProps extends StepProps {
  gameId: string
}

const CreateForGame = ({onComplete, onError, gameId, ...boxProps}: CreateForGameProps) => {
  const [didStart, setDidStart] = useState(false)

  const {handleStart, setupStatus, isCreating} = useAndroidServiceAccount({
    projectId: gameId,
    onError,
    onComplete,
  })

  useEffect(() => {
    handleStart().then(() => setDidStart(true))
  }, [gameId])

  return (
    <>
      <Box flexDirection="column" gap={1} {...boxProps}>
        <Box flexDirection="row" gap={1}>
          <Text>Creating a Service Account and API Key...</Text>
          {isCreating && <Spinner type="dots" />}
        </Box>
        {/* {setupStatus && <SetupStatusTable setupStatus={setupStatus} />} */}
        {didStart && <ProgressSpinner progress={(setupStatus?.progress || 0) * 100} spinnerType="dots" />}
      </Box>
    </>
  )
}
