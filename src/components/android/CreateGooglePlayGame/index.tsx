import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import open from 'open'
import {useContext, useEffect, useRef} from 'react'

import {getShortAuthRequiredUrl} from '@cli/api/index.js'
import {GameContext, Markdown} from '@cli/components/index.js'
import {WEB_URL, cacheKeys} from '@cli/constants/index.js'
import {BuildType, Platform} from '@cli/types/api.js'
import {
  KeyTestError,
  KeyTestResult,
  KeyTestStatus,
  getBuildSummary,
  getShortUUID,
  queryClient,
  scriptDir,
  useAndroidServiceAccountTestResult,
  useBuilds,
  useSafeInput,
} from '@cli/utils/index.js'

import {StepProps} from '../../index.js'

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

const Create = ({gameId, onComplete, onError, ...boxProps}: Props): JSX.Element => {
  const {data: result, isFetching} = useAndroidServiceAccountTestResult({projectId: gameId})
  const {data: builds} = useBuilds({pageNumber: 0, projectId: gameId})
  const previousIsFound = useRef<boolean>(false)

  // Trigger onComplete when the app is found
  useEffect(() => {
    const isFound = getIsAppFound(result)
    if (previousIsFound.current === false && isFound) {
      onComplete()
    }

    previousIsFound.current = isFound
  }, [result])

  useSafeInput(async (input) => {
    if (!gameId) return
    switch (input) {
      case 'r': {
        // Refresh when R is pressed
        queryClient.invalidateQueries({
          queryKey: cacheKeys.androidKeyTestResult({projectId: gameId}),
        })
        break
      }

      case 'd': {
        // Open the dashboard to download the game when D is pressed
        const dashUrl = await getShortAuthRequiredUrl(`/games/${getShortUUID(gameId)}/builds`)
        await open(dashUrl)
        break
      }
    }
  })

  const initialBuild = builds?.data.find(
    (build) => build.platform === Platform.ANDROID && build.buildType === BuildType.AAB,
  )

  const downloadCmd = initialBuild ? `${getBuildSummary(initialBuild).cmd}` : 'Initial AAB build not found!'

  const templateVars = {
    dashboardURL: new URL(`/games/${getShortUUID(gameId)}/builds`, WEB_URL).toString(),
    downloadCmd,
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
        <Markdown filename="create-google-play-game.md" templateVars={templateVars} />
      </Box>
    </>
  )
}
