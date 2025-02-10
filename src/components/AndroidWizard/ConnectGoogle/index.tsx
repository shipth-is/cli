import {Box, Text} from 'ink'
import qrcode from 'qrcode'

import {useContext, useEffect} from 'react'

import {StepProps} from '../utils.js'

import {getGoogleAuthUrl, getShortAuthRequiredUrl} from '@cli/api/index.js'
import {GameContext} from '@cli/components/context/index.js'

interface QRCodeProps {
  gameId: string
  helpPage: boolean
}

const QRCode = ({gameId, helpPage}: QRCodeProps) => {
  const handleLoad = async () => {
    const helpPagePath = `/docs/android?gameId=${gameId}#2-connect-shipthis-with-google`
    const url = helpPage ? await getShortAuthRequiredUrl(helpPagePath) : await getGoogleAuthUrl(gameId)

    const test = await qrcode.toString(url, {type: 'terminal'})

    //console.log(test)
  }

  useEffect(() => {
    handleLoad()
  }, [])

  return <></>
}

export const ConnectGoogle = (props: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)

  return (
    <Box flexDirection="column" gap={1} borderStyle="single" margin={1}>
      {gameId && <QRCode gameId={gameId} helpPage={true} />}
    </Box>
  )
}
