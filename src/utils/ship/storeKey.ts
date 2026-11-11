import {getProjectPlatformProgress} from '@cli/api/index.js'
import {Platform, ProjectPlatformProgress} from '@cli/types'
import {getPlatformName} from '@cli/utils/index.js'

import type {LogFunction} from './types.js'

interface StoreKeyInfo {
  setupCommand: string
  store: string
  storeKey: string
}

const STORE_KEY_INFO: Record<Platform, StoreKeyInfo> = {
  [Platform.ANDROID]: {
    setupCommand: 'shipthis game wizard android',
    store: 'Google Play',
    storeKey: 'Google Play Service Account API Key',
  },
  [Platform.IOS]: {
    setupCommand: 'shipthis apple apiKey create',
    store: 'App Store Connect',
    storeKey: 'App Store Connect API Key',
  },
}

// buildWhat names the platform in the warning, where other platforms still ship
const getStoreKeyHint = (platform: Platform, buildWhat = '') => {
  const {setupCommand, store} = STORE_KEY_INFO[platform]
  return (
    `To set one up, run:\n  ${setupCommand}\n` +
    `To build ${buildWhat}without uploading to ${store}, run:\n` +
    `  shipthis game ship --platform ${platform.toLowerCase()} --skipPublish`
  )
}

// The agent fails the publish step with a message like this one, but only after the build
export const getNoStoreKeyError = (platform: Platform) =>
  `This game has no ${STORE_KEY_INFO[platform].storeKey}, so it cannot be uploaded to ${STORE_KEY_INFO[platform].store}.\n` +
  getStoreKeyHint(platform)

export const getNoStoreKeyWarning = (platform: Platform) =>
  `Not shipping ${getPlatformName(platform)}: this game has no ${STORE_KEY_INFO[platform].storeKey}.\n` +
  getStoreKeyHint(platform, `${getPlatformName(platform)} `)

export const getStoreKeyCheckFailedWarning = (platform: Platform) =>
  `Could not check for a ${STORE_KEY_INFO[platform].storeKey}. Shipping anyway.`

type GetProgress = (projectId: string, platform: Platform) => Promise<ProjectPlatformProgress>

// hasApiKeyForPlatform comes from the backend progress route. Its "has store key" rule must
// stay the same as getCredentialsForJob in the backend, or this blocks ships that would work.
// A failed request counts as ready - a failed check must not block a ship.
async function getPlatformsMissingStoreKey(
  projectId: string,
  platforms: Platform[],
  warnLog: LogFunction,
  getProgress: GetProgress,
): Promise<Platform[]> {
  const results = await Promise.all(
    platforms.map(async (platform) => {
      try {
        const progress = await getProgress(projectId, platform)
        return progress.hasApiKeyForPlatform ? null : platform
      } catch {
        warnLog(getStoreKeyCheckFailedWarning(platform))
        return null
      }
    }),
  )
  return results.filter((platform): platform is Platform => platform !== null)
}

// Call only when the ship publishes. Returns the platforms to ship, or throws if none can.
export async function checkStoreKeys(
  projectId: string,
  platforms: Platform[],
  isDryRun: boolean,
  warnLog: LogFunction,
  getProgress: GetProgress = getProjectPlatformProgress,
): Promise<Platform[]> {
  const missing = await getPlatformsMissingStoreKey(projectId, platforms, warnLog, getProgress)
  if (missing.length === 0) return platforms

  // A dry run drops nothing, so "Not shipping X" would be wrong - use the error's words
  if (isDryRun) {
    for (const platform of missing) warnLog(getNoStoreKeyError(platform))
    return platforms
  }

  const ready = platforms.filter((platform) => !missing.includes(platform))
  if (ready.length === 0) throw new Error(missing.map((platform) => getNoStoreKeyError(platform)).join('\n\n'))

  for (const platform of missing) warnLog(getNoStoreKeyWarning(platform))
  return ready
}
