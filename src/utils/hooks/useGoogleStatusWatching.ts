// We watch by projectId - but get the status without the id

import {GoogleStatusResponse} from '@cli/types/api.js'
import {useWebSocket, WebSocketListener} from './useWebSocket.js'
import {useGoogleStatus} from '../query/useGoogleStatus.js'
import {useState, useEffect} from 'react'

// TODO: there is potentially an issue if users are setting up multiple projects at once
export interface GoogleStatusWatchingProps {
  projectId: string | null
  isWatching: boolean
  onGoogleStatusUpdate?: (status: GoogleStatusResponse) => void
}

export interface GoogleStatusWatchingResult {
  isLoading: boolean
  data: GoogleStatusResponse | null
}

export function useGoogleStatusWatching({
  projectId,
  isWatching,
  onGoogleStatusUpdate,
}: GoogleStatusWatchingProps): GoogleStatusWatchingResult {
  // The status that we receive over the websocket
  const [wsGoogleStatus, setWsGoogleStatus] = useState<GoogleStatusResponse | null>(null)

  const listener: WebSocketListener = {
    getPattern: () => `project.${projectId}:google-status`,
    eventHandler: async (pattern: string, data: any) => {
      setWsGoogleStatus(data)
      if (onGoogleStatusUpdate) onGoogleStatusUpdate(data)
    },
  }

  useWebSocket(isWatching ? [listener] : [])

  const {isLoading, data: googleStatus} = useGoogleStatus()

  useEffect(() => {
    setWsGoogleStatus(null)
  }, [projectId, isWatching, googleStatus])

  const fetchedGoogleStatus = googleStatus ? googleStatus : null
  const data = wsGoogleStatus ? wsGoogleStatus : fetchedGoogleStatus

  return {
    isLoading,
    data,
  }
}
