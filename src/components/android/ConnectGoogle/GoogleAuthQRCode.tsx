import {getGoogleAuthUrl, getShortAuthRequiredUrl} from '@cli/api/index.js'
import {QRCodeTerminal} from '@cli/components/common/index.js'
import {useEffect, useState} from 'react'

export async function getConnectUrl(gameId: string, helpPage: boolean): Promise<string> {
  // TODO: what if this changes
  const helpPagePath = `/docs/android?gameId=${gameId}#2-connect-shipthis-with-google`
  const url = helpPage ? await getShortAuthRequiredUrl(helpPagePath) : await getGoogleAuthUrl(gameId)
  return url
}

interface GoogleAuthQRCodeProps {
  gameId: string
  // Decides if we go to the page with the connect button or directly to google (after login)
  helpPage: boolean
}

// A QR code that can be scanned to connect a Google account to ShipThis
export const GoogleAuthQRCode = ({gameId, helpPage}: GoogleAuthQRCodeProps) => {
  const [url, setUrl] = useState<null | string>(null)

  const handleLoad = async () => {
    const url = await getConnectUrl(gameId, helpPage)
    setUrl(url)
  }

  useEffect(() => {
    handleLoad()
  }, [])

  return <>{url && <QRCodeTerminal url={url} />}</>
}
