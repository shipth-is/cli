import {Box, Text, useInput} from 'ink'
import {useContext, useEffect, useRef} from 'react'
import Spinner from 'ink-spinner'

import {
  getBuildSummary,
  KeyTestError,
  KeyTestResult,
  KeyTestStatus,
  queryClient,
  scriptDir,
  useAndroidServiceAccountTestResult,
  useBuilds,
} from '@cli/utils/index.js'
import {cacheKeys} from '@cli/constants/cacheKeys.js'

import {GameContext, Markdown} from '@cli/components/index.js'
import {StepProps} from '../../index.js'
import {Platform} from '@cli/types/api.js'
import {WEB_URL} from '@cli/constants/config.js'

const __dirname = scriptDir(import.meta)

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
  const {data: result, isFetching} = useAndroidServiceAccountTestResult({projectId: gameId})
  const {data: builds} = useBuilds({projectId: gameId, pageNumber: 0})
  const previousIsFound = useRef<boolean>(false)

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

  const initialBuild = builds?.data.find((build) => build.platform === Platform.ANDROID)
  const downloadCmd = initialBuild ? `${getBuildSummary(initialBuild).cmd}` : ''

  const templateVars = {
    downloadCmd,
    dashboardURL: new URL('/dashboard', WEB_URL).toString(),
  }

  return (
    <>
      <Box flexDirection="column" gap={1} {...boxProps}>
        <Box flexDirection="row" gap={1}>
          <Text bold>
            {isFetching ? 'Checking...' : 'ShipThis has not detected your game in Google Play. Press R to test again.'}
          </Text>
          {isFetching && <Spinner type="dots" />}
        </Box>
        <Markdown path={`${__dirname}/help.md`} templateVars={templateVars} />
      </Box>
    </>
  )
}
