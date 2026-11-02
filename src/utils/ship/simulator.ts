import type {Project, ShipGameFlags, SimulatorSession} from '@cli/types'

// Same text as the backend 403
export const SIMULATOR_NO_ACCESS_ERROR = 'The simulator is in early access and is not enabled for this account'

export const SIMULATOR_SAVED_MESSAGE =
  'Saved for 30 days. In a simulator session for this game, use App → Install last build.'
export const SIMULATOR_INSTALLING_MESSAGE = 'Installing in your simulator session.'

type SimulatorFlags = {download?: string; downloadAPK?: string; platform?: string; simulator?: boolean}

// Checked in `game ship` before the zip. The backend also refuses a non-iOS simulator job.
export function getSimulatorFlagError(flags: SimulatorFlags): null | string {
  if (!flags.simulator) return null
  if (flags.platform !== 'ios') return '--simulator is only for iOS builds'
  // The build is uploaded after the job completes, and it is an APP, not an IPA
  if (flags.download || flags.downloadAPK) return '--download is not available for simulator builds yet'
  return null
}

// A simulator job always uses demo credentials and never publishes
export function getShipMode(
  flags: Pick<ShipGameFlags, 'simulator' | 'skipPublish' | 'useDemoCredentials'>,
  project: Pick<Project, 'details'>,
): {isPublishing: boolean; isUsingDemoCredentials: boolean} {
  const projectUsesDemoCredentials = Boolean(project.details?.useDemoCredentials)
  const isUsingDemoCredentials = Boolean(flags.simulator) || (flags.useDemoCredentials ?? projectUsesDemoCredentials)
  const isPublishing = !flags.skipPublish && !isUsingDemoCredentials
  return {isPublishing, isUsingDemoCredentials}
}

// projectId must be the full UUID - --gameId can be a short ID
export function getSimulatorCompleteMessage(session: null | SimulatorSession, projectId: string): string {
  return session?.projectId === projectId ? SIMULATOR_INSTALLING_MESSAGE : SIMULATOR_SAVED_MESSAGE
}
