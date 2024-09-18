import {useEffect} from 'react'
import {io} from 'socket.io-client'

import {WS_URL} from '@cli/constants/index.js'
import {getAuthToken} from '@cli/api/index.js'

export interface WebSocketListener {
  // What we listen to
  getPattern: () => string | string[]
  // What we run
  eventHandler: (pattern: string, data: any) => Promise<void>
}

export function useWebSocket(listeners: WebSocketListener[] = []) {
  const log = false ? console.debug : () => {}

  useEffect(() => {
    if (listeners.length === 0) {
      log('Not subscribing to WebSocket - no listeners')
      return
    }

    const token = getAuthToken()
    const socket = io(WS_URL, {
      auth: {token},
      forceNew: true,
    })

    socket.on('connect', () => log('Connected to WebSocket'))

    for (const listener of listeners) {
      const pattern = listener.getPattern()
      const bindSocket = (pattern: string) => {
        const boundListener = listener.eventHandler.bind(listener, pattern)
        log('Subscribing to', pattern)
        socket.on(pattern, boundListener)
      }
      if (Array.isArray(pattern)) return pattern.forEach(bindSocket)
      bindSocket(pattern)
    }

    return () => {
      log('Disconnecting from WebSocket')
      socket.disconnect()
    }
  }, [])
}
