import {useEffect, useRef, useState} from 'react'
import {DateTime} from 'luxon'

import {WebSocketListener, useWebSocket} from './useWebSocket.js'
import {RuntimeLogEntry} from '@cli/types/api.js'

interface Props {
  projectId: string
  buildId: string
  tailLength?: number
  maxMessages?: number
  flushIntervalMs?: number
}

interface Response {
  messages: RuntimeLogEntry[]
  tail: RuntimeLogEntry[]
}

// Saves incoming runtime log entries to a ref queue, and flushes them to state
// at a regular interval. This reduces the number of re-renders.
export function useGoRuntimeLogListener({
  projectId,
  buildId,
  tailLength = 10,
  maxMessages = 500,
  flushIntervalMs = 100, // 10fps
}: Props): Response {
  const [messages, setMessages] = useState<RuntimeLogEntry[]>([])
  const [tail, setTail] = useState<RuntimeLogEntry[]>([])

  const queueRef = useRef<RuntimeLogEntry[]>([])

  const listener: WebSocketListener = {
    async eventHandler(_: string, rawLog: any) {
      queueRef.current.push({
        ...rawLog,
        sentAt: DateTime.fromISO(rawLog.sentAt),
      })
    },

    getPattern: () => [`project.${projectId}:build.${buildId}:runtime-log`],
  }

  useWebSocket([listener])

  useEffect(() => {
    const id = setInterval(() => {
      const queued = queueRef.current
      if (queued.length === 0) return

      queueRef.current = []

      setMessages((prev) => {
        const next = [...prev, ...queued]
        return next.length > maxMessages ? next.slice(-maxMessages) : next
      })

      setTail((prev) => {
        const next = [...prev, ...queued]
        return next.length > tailLength ? next.slice(-tailLength) : next
      })
    }, flushIntervalMs)

    return () => clearInterval(id)
  }, [tailLength, maxMessages, flushIntervalMs])

  return {messages, tail}
}
