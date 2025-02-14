import {Box, Text, useInput} from 'ink'
import {useContext, useEffect, useRef} from 'react'

import {
  KeyTestError,
  KeyTestResult,
  KeyTestStatus,
  queryClient,
  useAndroidServiceAccountTestResult,
} from '@cli/utils/index.js'
import {cacheKeys} from '@cli/constants/cacheKeys.js'

import {GameContext, StepProps} from '../index.js'
import Spinner from 'ink-spinner'

// Util to check if the app is based on key test result
const getIsAppFound = (result?: KeyTestResult): boolean => {
  // If we get the "not invited" error, then we know the app exists
  const isFound =
    result?.status === KeyTestStatus.SUCCESS ||
    (result?.status === KeyTestStatus.ERROR && result?.error === KeyTestError.NOT_INVITED)
  return isFound
}

// Hook needs the gameId so we have a wrapper
export const CreateGooglePlayGame = (props: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)
  return <>{gameId && <Create gameId={gameId} {...props} />}</>
}

interface Props extends StepProps {
  gameId: string
}

const Create = ({onComplete, onError, gameId, ...boxProps}: Props): JSX.Element => {
  const previousIsFound = useRef<boolean>(false)

  const {data: result, isFetching} = useAndroidServiceAccountTestResult({projectId: gameId})

  // Trigger onComplete when the app is found
  useEffect(() => {
    const isFound = getIsAppFound(result)
    if (previousIsFound.current === false && isFound) {
      onComplete()
    }
    previousIsFound.current = isFound
  }, [result])

  // Refresh when R is pressed
  useInput(async (input) => {
    if (!gameId) return
    if (input !== 'r') return
    queryClient.invalidateQueries({
      queryKey: cacheKeys.androidKeyTestResult({projectId: gameId}),
    })
  })

  // TODO
  const isFound = !isFetching && getIsAppFound(result)

  return (
    <>
      <Box flexDirection="column" gap={1} {...boxProps}>
        <Text>Create the game in Google Play</Text>
        {isFetching && (
          <Box flexDirection="row" gap={1}>
            <Text>Checking...</Text>
            <Spinner type="dots" />
          </Box>
        )}
        <Text>TODO: show some instructions</Text>
        <Text>Press R to test again</Text>
      </Box>
    </>
  )
}
