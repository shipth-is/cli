import {Box, Text, useInput} from 'ink'
import qrcode from 'qrcode'
import open from 'open'

import {useContext, useEffect, useState} from 'react'

import {getGoogleAuthUrl, getShortAuthRequiredUrl} from '@cli/api/index.js'
import {GameContext} from '@cli/components/context/index.js'

import {StepProps} from '../utils.js'

interface QRCodeProps {
  gameId: string
  helpPage: boolean
}

async function getUrl(gameId: string, helpPage: boolean): Promise<string> {
  // TODO: what if this changes
  const helpPagePath = `/docs/android?gameId=${gameId}#2-connect-shipthis-with-google`
  const url = helpPage ? await getShortAuthRequiredUrl(helpPagePath) : await getGoogleAuthUrl(gameId)
  return url
}

const QRCode = ({gameId, helpPage}: QRCodeProps) => {
  const [code, setCode] = useState('')

  const handleLoad = async () => {
    const url = await getUrl(gameId, helpPage)
    const codeString = await qrcode.toString(url, {type: 'terminal', errorCorrectionLevel: 'L', small: true})
    setCode(codeString)
  }

  useEffect(() => {
    handleLoad()
  }, [])

  return (
    <>
      <Text>{code}</Text>
    </>
  )
}

export const ConnectGoogle = (props: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)

  useInput(async (input) => {
    if (!gameId) return
    if (input !== 'd') return
    const url = await getUrl(gameId, true)
    await open(url)
  })

  return (
    <Box flexDirection="column" gap={1} borderStyle="single" margin={1}>
      <Text>Scan the QR code below to connect your Google account to ShipThis:</Text>
      {gameId && <QRCode gameId={gameId} helpPage={true} />}
      <Text>Or press D to sign-in using your browser</Text>
    </Box>
  )
}
