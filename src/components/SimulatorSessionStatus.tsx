import {Box, Text} from 'ink'
import {DateTime} from 'luxon'
import {useEffect, useRef, useState} from 'react'

import {SimulatorSession, SimulatorStatus} from '@cli/types/api.js'
import {formatDuration, getPlatformName, getShortUUID} from '@cli/utils/index.js'
import {isSessionOver, useSimulatorSession} from '@cli/utils/query/useSimulatorSession.js'

// Seconds elapsed since the session went RUNNING, ticking once a second so the
// "2m 13s / 30m" readout stays live. Stays at 0 until the session starts: time
// spent queueing does not count against the session's limit.
function useElapsedSeconds(startedAt?: DateTime | null): number {
  const [elapsed, setElapsed] = useState(0)
  const startMillis = startedAt?.isValid ? startedAt.toMillis() : null

  useEffect(() => {
    if (startMillis === null) {
      setElapsed(0)
      return
    }

    const tick = () => setElapsed(Math.max(0, Math.round((Date.now() - startMillis) / 1000)))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [startMillis])

  return elapsed
}

interface Props {
  // The session as returned by POST /simulator/start.
  initialSession: SimulatorSession
  // Called once, when the session has finished.
  onSessionEnded: (session: null | SimulatorSession) => void
  // The --maxDuration the user asked for, if they used the flag. The backend
  // ignores it when it hands back an already-running session, so we compare.
  requestedMaxDuration?: number
}

// Live status for a simulator session: which state it is in, how long it has
// been running and how much of its time budget is left.
export const SimulatorSessionStatus = ({initialSession, onSessionEnded, requestedMaxDuration}: Props) => {
  const {data: session} = useSimulatorSession({initialSession})
  const elapsed = useElapsedSeconds(session?.startedAt)

  const maxDuration = session?.maxDurationSeconds ?? null
  const remaining = maxDuration === null ? null : Math.max(0, maxDuration - elapsed)
  // The backend ends the session when its time is up, but our poll is slower
  // than the clock, so an exhausted budget counts as ended too.
  const isOver = isSessionOver(session ?? null) || remaining === 0

  const hasEnded = useRef(false)
  useEffect(() => {
    if (!isOver || hasEnded.current) return
    hasEnded.current = true
    onSessionEnded(session ?? null)
  }, [isOver, session])

  // We asked for a limit and got a different one, which means the backend
  // returned a session that was already running instead of creating one.
  const wasIgnored = Boolean(requestedMaxDuration && maxDuration !== null && maxDuration !== requestedMaxDuration)

  const parts: string[] = []
  if (session) parts.push(session.status.toLowerCase())
  if (session?.startedAt?.isValid) {
    const used = formatDuration(elapsed)
    parts.push(maxDuration === null ? used : `${used} / ${formatDuration(maxDuration)}`)
    if (remaining !== null && !isOver) parts.push(`${formatDuration(remaining)} left`)
  } else if (maxDuration !== null) {
    parts.push(`limit ${formatDuration(maxDuration)}`)
  }

  return (
    <Box flexDirection="column">
      <Text>Simulator session started for platform: {getPlatformName(initialSession.platform)}</Text>
      <Text>Session ID: {getShortUUID(initialSession.id)}</Text>
      <Text>Status: {parts.join(' · ')}</Text>
      {wasIgnored && (
        <Text color="yellow">
          Reconnected to an existing session - its limit is {formatDuration(maxDuration as number)}, not the{' '}
          {formatDuration(requestedMaxDuration as number)} you asked for. Stop that session before starting one with a
          different limit.
        </Text>
      )}
      {isOver && (
        <Text color="yellow">
          {session?.status === SimulatorStatus.FAILED ? 'Simulator session failed.' : 'Simulator session ended.'}
        </Text>
      )}
    </Box>
  )
}
