// A process-wide shared socket.io connection.
//
// Many components can be mounted at once watching the same job (progress bar,
// log tail, status table, JobFollow...). Each used to open its own socket via
// useWebSocket, so a single "ship" screen could hold several connections to the
// same server, all subscribed to the same overlapping patterns. This module
// keeps ONE connection alive and multiplexes every subscription over it:
//
//   - acquire()/release() ref-count consumers; we connect on the first and
//     disconnect once the last one goes away.
//   - subscribe() registers exactly one socket-level listener per distinct
//     pattern (a fan-out dispatcher) no matter how many consumers want it, and
//     hands back an unsubscribe that detaches the socket listener only when the
//     last consumer of that pattern leaves.
//
// The React binding lives in utils/hooks/useWebSocket.ts; this module is plain,
// framework-agnostic connection state.

import {Socket, io} from 'socket.io-client'

import {getAuthToken} from '@cli/api/index.js'
import {WS_URL} from '@cli/constants/index.js'

type Dispatch = (data: any) => void

let socket: Socket | null = null
let refCount = 0
// pattern -> set of consumer dispatch callbacks. The presence of a key also
// tracks that we've registered the single socket-level listener for it.
const handlers = new Map<string, Set<Dispatch>>()

// Mark a consumer as using the connection, creating the socket on first use.
// Pair every acquire() with exactly one release().
export function acquire(): Socket {
  if (!socket) {
    // Function-form auth so reconnects pick up a fresh token. No forceNew: we
    // explicitly want socket.io to reuse this single connection.
    socket = io(WS_URL, {auth: (cb) => cb({token: getAuthToken()})})
  }

  refCount += 1
  return socket
}

// Drop a consumer; tear the connection down once nobody is using it.
export function release(): void {
  refCount -= 1
  if (refCount <= 0) {
    refCount = 0
    if (socket) {
      socket.disconnect()
      socket = null
    }

    handlers.clear()
  }
}

// Attach a dispatch callback for a pattern. Returns an unsubscribe function.
export function subscribe(pattern: string, dispatch: Dispatch): () => void {
  if (!socket) {
    throw new Error('subscribe() called before acquire()')
  }

  let consumers = handlers.get(pattern)
  if (!consumers) {
    consumers = new Set()
    handlers.set(pattern, consumers)
    // One socket-level listener per pattern, fanning out to every consumer.
    socket.on(pattern, (data: any) => {
      for (const consumer of handlers.get(pattern) ?? []) {
        consumer(data)
      }
    })
  }

  consumers.add(dispatch)

  return () => {
    const set = handlers.get(pattern)
    if (!set) return
    set.delete(dispatch)
    if (set.size === 0) {
      socket?.off(pattern)
      handlers.delete(pattern)
    }
  }
}
