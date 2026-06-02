import {useEffect, useRef} from 'react'

import {acquire, release, subscribe} from '@cli/utils/socket.js'

export interface WebSocketListener {
  // What we run
  eventHandler: (pattern: string, data: any) => Promise<void>
  // What we listen to
  getPattern: () => string | string[]
  // Some meta-data
  id?: string
}

const patternsOf = (listener: WebSocketListener): string[] => {
  const pattern = listener.getPattern()
  return Array.isArray(pattern) ? pattern : [pattern]
}

export function useWebSocket(listeners: WebSocketListener[] = []) {
  // Debug toggle. Never let this become console.* to stdout: ink intercepts
  // console output and re-renders the frame, so chatty logging flickers the TUI.
  // eslint-disable-next-line no-constant-condition -- intentional: toggle for debugging
  const log = false ? console.debug : (..._args: any[]) => {}

  // Always point at the latest listeners so the (stable) socket handlers below
  // dispatch to the current eventHandler. Callers rebuild the listener objects
  // every render, but the handlers only close over stable things (state
  // setters, queryClient), so we never need to re-subscribe just for those.
  const listenersRef = useRef(listeners)
  useEffect(() => {
    listenersRef.current = listeners
  })

  // Re-subscribe only when the *set of patterns* changes. Depending on the
  // listeners array identity (it's rebuilt every render) would re-run this on
  // every render — under ink that means every spinner frame and keystroke.
  // Deriving the key from getPattern() also means going from [] (not watching)
  // to [patterns] (watching) flips the key and correctly forces a subscription.
  const patternKey = listeners.flatMap(patternsOf).sort().join('|')

  useEffect(() => {
    if (!patternKey) {
      log('Not subscribing to WebSocket - no listeners')
      return
    }

    // Share one connection across every mounted consumer (see utils/socket.ts).
    acquire()

    const uniquePatterns = new Set(patternKey.split('|'))
    const unsubscribes = [...uniquePatterns].map((pattern) => {
      log('Subscribing to', pattern)
      return subscribe(pattern, (data: any) => {
        for (const listener of listenersRef.current) {
          if (patternsOf(listener).includes(pattern)) {
            listener.eventHandler(pattern, data)
          }
        }
      })
    })

    return () => {
      log('Unsubscribing from WebSocket')
      for (const unsubscribe of unsubscribes) unsubscribe()
      release()
    }
  }, [patternKey])
}
