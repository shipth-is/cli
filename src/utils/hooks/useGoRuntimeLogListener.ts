import {useState} from 'react'
import {DateTime} from 'luxon'

import {WebSocketListener, useWebSocket} from './useWebSocket.js'
import {RuntimeLogEntry} from '@cli/types/api.js'

interface Props {
  projectId: string
  buildId: string
  tailLength?: number
}

interface Response {
  messages: RuntimeLogEntry[]
  tail: RuntimeLogEntry[]
}

// Listens for Go runtime logs for a build via WebSocket and gives a tail
export function useGoRuntimeLogListener({projectId, buildId, tailLength = 10}: Props): Response {
  const [messages, setMessages] = useState<RuntimeLogEntry[]>([])
  const [tail, setTail] = useState<RuntimeLogEntry[]>([])

  const listener: WebSocketListener = {
    async eventHandler(_: string, rawLog: any) {
      const log: RuntimeLogEntry = {
        ...rawLog,
        sentAt: DateTime.fromISO(rawLog.sentAt),
      }
      setMessages((prev) => [...prev, log])
      setTail((prev) => {
        const next = [...prev, log]
        if (next.length > tailLength) next.shift()
        return next
      })
      //console.log(log.message)
    },

    getPattern: () => [`project.${projectId}:build.${buildId}:runtime-log`],
  }

  useWebSocket([listener])

  return {messages, tail}
}
