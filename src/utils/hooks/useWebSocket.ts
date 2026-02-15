import {useEffect, useRef} from 'react'
import {io} from 'socket.io-client'

import {getAuthToken} from '@cli/api/index.js'
import {WS_URL} from '@cli/constants/index.js'

export interface WebSocketListener {
  // What we run
  eventHandler: (pattern: string, data: any) => Promise<void>
  // What we listen to
  getPattern: () => string | string[]
}

export function useWebSocket(listeners: WebSocketListener[] = []) {
  const log = false ? console.debug : () => {}
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  useEffect(() => {
    if (listeners.length === 0) {
      log('Not subscribing to WebSocket - no listeners')
      return
    }

    if (!socketRef.current) {
      const token = getAuthToken()
      socketRef.current = io(WS_URL, {
        auth: {token},
      })
    }
    const socket = socketRef.current

    socket.on('connect', () => log('Connected to WebSocket'))

    for (const listener of listeners) {
      const pattern = listener.getPattern()
      const bindSocket = (pattern: string) => {
        const boundListener = listener.eventHandler.bind(listener, pattern)
        log('Subscribing to', pattern)
        socket.on(pattern, boundListener)
      }

      if (Array.isArray(pattern)) {
        pattern.forEach(bindSocket)
        continue
      }

      bindSocket(pattern)
    }
  }, [])

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [])
}
