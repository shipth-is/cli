import {WEB_URL} from '@cli/constants/config.js'
import {Job, Platform} from '@cli/types'
import {getShortUUID} from '@cli/utils/uuid.js'

// The last 10 lines of an iOS build hold the fastlane summary table, not the
// error that caused it. 25 lines reaches back past the table.
export const FAILURE_LOG_TAIL_LENGTH = 25

// One failed job, in the form ship-failure.md.ejs needs
export interface ShipFailure {
  dashboardUrl: string
  jobId: string
  logsCommand: string
  platform: string
}

export interface ShipFailureVars {
  failures: ShipFailure[]
  showLogTail: boolean
  tailLength: number
}

export function getPlatformLabel(platform: Platform): string {
  return platform === Platform.IOS ? 'iOS' : 'Android'
}

// Builds the variables for ship-failure.md.ejs. Every failed job gets its own log
// command and dashboard link - when both platforms fail, one link is not enough.
export function getShipFailureVars(
  failedJobs: Job[],
  gameId: string,
  {showLogTail, tailLength = FAILURE_LOG_TAIL_LENGTH}: {showLogTail: boolean; tailLength?: number},
): ShipFailureVars {
  const failures = failedJobs.map((job) => {
    const jobId = getShortUUID(job.id)
    return {
      dashboardUrl: `${WEB_URL}games/${getShortUUID(gameId)}/job/${jobId}`,
      jobId,
      logsCommand: `shipthis game job logs ${jobId}`,
      platform: getPlatformLabel(job.type),
    }
  })

  return {failures, showLogTail, tailLength}
}
