import {Box, Text, useInput} from 'ink'
import open from 'open'
import {useContext} from 'react'

import {GameContext} from '@cli/components/context/index.js'

import {StepProps} from '../utils.js'

import {getConnectUrl, GoogleAuthQRCode} from './GoogleAuthQRCode.js'
import {useGoogleStatusWatching} from '@cli/utils/hooks/useGoogleStatusWatching.js'
import {GoogleStatusResponse} from '@cli/types/api.js'

export const ConnectGoogle = (props: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)

  const handleGoogleStatusUpdate = async (status: GoogleStatusResponse) => {
    if (status.isAuthenticated) return props.onComplete()
  }

  useGoogleStatusWatching({
    projectId: gameId,
    isWatching: true,
    onGoogleStatusUpdate: handleGoogleStatusUpdate,
  })

  useInput(async (input) => {
    if (!gameId) return
    if (input !== 'd') return
    const url = await getConnectUrl(gameId, true)
    await open(url)
  })

  return (
    <Box flexDirection="column" gap={1} borderStyle="single" margin={1}>
      <Text>Scan the QR code below to connect your Google account to ShipThis:</Text>
      {gameId && <GoogleAuthQRCode gameId={gameId} helpPage={true} />}
      <Text>Or press D to sign-in using your browser</Text>
    </Box>
  )
}
