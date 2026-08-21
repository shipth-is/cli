import {UseQueryResult, useQuery} from '@tanstack/react-query'
import {AxiosError} from 'axios'

import {getActiveSimulatorSession} from '@cli/api/index.js'
import {cacheKeys} from '@cli/constants/index.js'
import {SimulatorSession, SimulatorStatus} from '@cli/types'

// How often we ask the backend for the session. There are no websocket events
// for simulator sessions, so this is a poll - and it only feeds a status line,
// so it stays slow.
const POLL_INTERVAL_MS = 5000

export const isSessionOver = (session: null | SimulatorSession): boolean =>
  !session || [SimulatorStatus.COMPLETED, SimulatorStatus.FAILED].includes(session.status)

export interface SimulatorSessionQueryProps {
  // The session as returned by POST /simulator/start. Used as the initial value
  // so the UI has something to show before the first poll comes back.
  initialSession: SimulatorSession
}

// Follows the user's active simulator session. Polling stops once the session
// has finished (or has gone away entirely, which the API reports as a 404).
export const useSimulatorSession = ({
  initialSession,
}: SimulatorSessionQueryProps): UseQueryResult<null | SimulatorSession, AxiosError> =>
  useQuery<null | SimulatorSession, AxiosError>({
    initialData: initialSession,
    queryFn: getActiveSimulatorSession,
    queryKey: cacheKeys.simulatorSession(),
    refetchInterval: ({state}) => (isSessionOver(state.data ?? null) ? false : POLL_INTERVAL_MS),
  })
