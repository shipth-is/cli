import {Box, Text, useInput} from 'ink'
import open from 'open'
import {useContext} from 'react'

import {WEB_URL} from '@cli/constants/index.js'
import {scriptDir, useGoogleStatusWatching} from '@cli/utils/index.js'
import {GoogleStatusResponse} from '@cli/types/api.js'
import {GameContext, Markdown, StepProps} from '@cli/components/index.js'

import {getConnectUrl, GoogleAuthQRCode} from './GoogleAuthQRCode.js'

const __dirname = scriptDir(import.meta)
interface Props extends StepProps {
  helpPage?: boolean
}
// Wrapper pattern again to make sure hook has the gameId
export const ConnectGoogle = (props: Props): JSX.Element => {
  const {gameId} = useContext(GameContext)
  return <>{gameId && <ConnectForGame gameId={gameId} {...props} />}</>
}

interface ConnectWithGameProps extends Props {
  gameId: string
}

const ConnectForGame = ({onComplete, onError, helpPage, gameId, ...boxProps}: ConnectWithGameProps): JSX.Element => {
  useGoogleStatusWatching({
    projectId: gameId,
    isWatching: true,
    onGoogleStatusUpdate: (status: GoogleStatusResponse) => {
      if (status.isAuthenticated) return onComplete()
    },
  })

  useInput(async (input) => {
    if (!gameId) return
    if (input !== 'd') return
    const url = await getConnectUrl(gameId, true)
    await open(url)
  })

  const templateVars = {
    privacyURL: new URL('/privacy', WEB_URL).toString(),
  }

  return (
    <Box flexDirection="column" gap={1} {...boxProps}>
      <Markdown path={`${__dirname}/privacy-notification.md`} templateVars={templateVars} />
      <Text>Scan the QR code below to connect your Google account to ShipThis:</Text>
      {gameId && <GoogleAuthQRCode gameId={gameId} helpPage={!!helpPage} />}
      <Text>Or press D to sign-in using your browser</Text>
    </Box>
  )
}
