import {Platform, Project, ShipGameFlags} from '@cli/types'
import {queryProjectCredentials} from '@cli/utils/index.js'

import {LogFunction} from './types.d.js'

export function formatProgressLog(
  label: string,
  data: {progress: number; elapsedSeconds: number; speedMBps: number; [key: string]: any},
  bytesKey: 'writtenBytes' | 'loadedBytes',
  totalKey: 'estimatedTotalBytes' | 'totalBytes',
  isEstimated = false,
): string {
  const elapsed = data.elapsedSeconds.toFixed(1)
  const transferredMB = (data[bytesKey] / 1024 / 1024).toFixed(2)
  const totalMB = (data[totalKey] / 1024 / 1024).toFixed(2)
  const progressPercent = Math.round(data.progress * 100)
  const speed = data.speedMBps.toFixed(2)
  const totalPrefix = isEstimated ? '~' : ''
  return `${label}: ${progressPercent}% (${transferredMB}MB / ${totalPrefix}${totalMB}MB) - ${elapsed}s - ${speed}MB/s`
}

// Tells us which platforms are being shipped (used to select the files)
export async function getPlatforms(project: Project, flags: ShipGameFlags, log: LogFunction): Promise<Platform[]> {
  log('Determining platforms to ship...')
  const specifiedPlatform = flags.platform ? (flags.platform.toUpperCase() as Platform) : null
  if (specifiedPlatform) {
    log(`Platform specified: ${specifiedPlatform}`)
    return [specifiedPlatform]
  }
  // If the flag was used (--useDemoCredentials) then a platform was specified - so we only look on project
  log('No platform specified, fetching project credentials...')
  const useDemoCredentials = Boolean(project.details?.useDemoCredentials)
  if (useDemoCredentials) return [Platform.ANDROID, Platform.IOS]
  // Otherwise see what is configured
  log('Fetching project credentials...')
  const response = await queryProjectCredentials({
    projectId: project.id,
    pageNumber: 0,
    pageSize: 100,
  })
  log(`Found ${response.data.length} project credentials, filtering to active ones...`)
  const credentialPlatforms = [...new Set(response.data.filter((cred) => cred.isActive).map((cred) => cred.platform))]
  log(`Active platforms: ${credentialPlatforms.join(', ')}`)
  return credentialPlatforms
}
