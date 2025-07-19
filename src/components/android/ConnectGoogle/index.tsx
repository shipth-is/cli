import {Box, Text, useInput} from 'ink'
import open from 'open'
import {useContext, useEffect, useState} from 'react'

import {GameContext, Markdown, StepProps} from '@cli/components/index.js'
import {WEB_URL} from '@cli/constants/index.js'
import {GoogleStatusResponse} from '@cli/types/api.js'
import {useGoogleStatusWatching} from '@cli/utils/index.js'

import {GoogleAuthQRCode, getConnectUrl} from './GoogleAuthQRCode.js'

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

const ConnectForGame = ({gameId, helpPage, onComplete, onError, ...boxProps}: ConnectWithGameProps): JSX.Element => {
  const [showQRCode, setShowQRCode] = useState(false)
  const [connectUrl, setConnectUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchConnectUrl = async () => {
      const url = await getConnectUrl(gameId, Boolean(helpPage))
      setConnectUrl(url)
    }
    if (!connectUrl) fetchConnectUrl()
  }, [])

  useGoogleStatusWatching({
    isWatching: true,
    onGoogleStatusUpdate(status: GoogleStatusResponse) {
      if (status.isAuthenticated) return onComplete()
    },
    projectId: gameId,
  })

  useInput(async (input) => {
    const i = input.toLowerCase()
    switch (i) {
      case 'q': {
        setShowQRCode(true)
        return
      }

      case 'x': {
        setShowQRCode(false)
        return
      }

      case 'b': {
        if (!gameId) return
        if (!connectUrl) return
        await open(connectUrl)
        return
      }

      default:
    }
  })

  const templateVars = {
    privacyURL: new URL('/privacy', WEB_URL).toString(),
  }

  return (
    <Box flexDirection="column" gap={1} {...boxProps}>
      {!showQRCode && (
        <Box flexDirection="column" gap={1}>
          <Markdown filename="privacy-notification.md" templateVars={templateVars} />
          {connectUrl && (
            <Text bold color="#4CE64C">
              {`Press B to open ${connectUrl} in your browser and connect your Google account to ShipThis`}
            </Text>
          )}
          <Text bold color="#4CE64C">
            Press Q to show a QR-code to connect using your mobile phone
          </Text>
        </Box>
      )}

      {showQRCode && (
        <Box flexDirection="column" gap={1}>
          <Text>Scan the QR code below to connect your Google account to ShipThis:</Text>
          {gameId && <GoogleAuthQRCode gameId={gameId} helpPage={Boolean(helpPage)} />}
          <Text bold color="#4CE64C">
            Press X to hide the QR code
          </Text>
        </Box>
      )}
    </Box>
  )
}
