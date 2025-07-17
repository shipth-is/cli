// We watch by projectId - but get the status without the id

import {useEffect, useState} from 'react'

import {GoogleStatusResponse} from '@cli/types/api.js'

import {useGoogleStatus} from '../query/useGoogleStatus.js'

import {WebSocketListener, useWebSocket} from './useWebSocket.js'

// TODO: there is potentially an issue if users are setting up multiple projects at once
export interface GoogleStatusWatchingProps {
  isWatching: boolean
  onGoogleStatusUpdate?: (status: GoogleStatusResponse) => void
  projectId: null | string
}

export interface GoogleStatusWatchingResult {
  data: GoogleStatusResponse | null
  isLoading: boolean
}

export function useGoogleStatusWatching({
  isWatching,
  onGoogleStatusUpdate,
  projectId,
}: GoogleStatusWatchingProps): GoogleStatusWatchingResult {
  // The status that we receive over the websocket
  const [wsGoogleStatus, setWsGoogleStatus] = useState<GoogleStatusResponse | null>(null)

  const listener: WebSocketListener = {
    async eventHandler(pattern: string, data: any) {
      setWsGoogleStatus(data)
      if (onGoogleStatusUpdate) onGoogleStatusUpdate(data)
    },
    getPattern: () => `project.${projectId}:google-status`,
  }

  useWebSocket(isWatching ? [listener] : [])

  const {data: googleStatus, isLoading} = useGoogleStatus()

  useEffect(() => {
    setWsGoogleStatus(null)
  }, [projectId, isWatching, googleStatus])

  const fetchedGoogleStatus = googleStatus ? googleStatus : null
  const data = wsGoogleStatus ? wsGoogleStatus : fetchedGoogleStatus

  return {
    data,
    isLoading,
  }
}
