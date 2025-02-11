import {Text} from 'ink'
import qrcode from 'qrcode'

import {useEffect, useState} from 'react'

// A QR code that can be displayed in the terminal
export const QRCodeTerminal = ({url}: {url: string}) => {
  const [code, setCode] = useState<null | string>(null)

  const handleLoad = async () => {
    const codeString = await qrcode.toString(url, {type: 'terminal', errorCorrectionLevel: 'L', small: true})
    setCode(codeString)
  }

  useEffect(() => {
    handleLoad()
  }, [])

  return <>{code && <Text>{code}</Text>}</>
}
