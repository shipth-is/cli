import fg from 'fast-glob'

import {
  DEFAULT_PLATFORM_GLOBS,
  LEGACY_DEFAULT_IGNORED_FILES_GLOBS,
  LEGACY_DEFAULT_SHIPPED_FILES_GLOBS,
} from '../../constants/index.js'
import {Platform, type ProjectConfig} from '../../types/index.js'

import type {LogFunction} from './types.js'

export type ShipGlobResolution = {
  mode: 'legacy' | 'new'
  patterns: string[]
  ignore: string[]
  warningMessage?: string
}
const LEGACY_DEFAULTS_WARNING_MESSAGE =
  'Using legacy default globs with new platform-aware file selection. Learn more: https://shipth.is/docs/guides/controlling-uploaded-files'

// Trim and drop empties.
function normalize(value: string[] | undefined): string[] | undefined {
  if (!value) return undefined
  return value.map((v) => v.trim()).filter(Boolean)
}

// Ordered equality.
function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

// Legacy ignore equals default.
function isLegacyIgnoredDefault(ignoredFilesGlobs: string[]): boolean {
  const normalized = normalize(ignoredFilesGlobs)
  if (!normalized) return false
  // Historical DEFAULT_IGNORED_FILES_GLOBS prior to the `.godot/**` addition.
  const knownLegacyIgnoredDefaults: readonly string[][] = [
    LEGACY_DEFAULT_IGNORED_FILES_GLOBS,
    ['.git', '.gitignore', 'shipthis.json', 'shipthis-*.zip'],
  ]
  return knownLegacyIgnoredDefaults.some((snapshot) => arraysEqual(snapshot, normalized))
}

// Legacy shipped equals default.
function isLegacyShippedDefault(shippedFilesGlobs: string[]): boolean {
  const normalized = normalize(shippedFilesGlobs)
  if (!normalized) return false
  return arraysEqual(LEGACY_DEFAULT_SHIPPED_FILES_GLOBS, normalized)
}

// Platform-specific excludes (single-platform only).
function getPlatformSpecificIgnore(
  platforms: Platform[],
  iosExclude: string[],
  androidExclude: string[],
): string[] {
  if (platforms.length !== 1) return []
  if (platforms[0] === Platform.IOS) return iosExclude
  if (platforms[0] === Platform.ANDROID) return androidExclude
  return []
}

// Resolve effective `globs` (config overrides defaults).
function resolvePlatformGlobs(projectConfig: ProjectConfig): {
  baseInclude: string[]
  baseExclude: string[]
  androidExclude: string[]
  iosExclude: string[]
} {
  return {
    baseInclude: projectConfig.globs?.base?.include ?? DEFAULT_PLATFORM_GLOBS.base.include,
    baseExclude: projectConfig.globs?.base?.exclude ?? DEFAULT_PLATFORM_GLOBS.base.exclude,
    androidExclude: projectConfig.globs?.android?.exclude ?? DEFAULT_PLATFORM_GLOBS.android.exclude,
    iosExclude: projectConfig.globs?.ios?.exclude ?? DEFAULT_PLATFORM_GLOBS.ios.exclude,
  }
}

// Resolve ship patterns + ignore + warning message.
export function resolveShipGlobConfig(projectConfig: ProjectConfig, platforms: Platform[]): ShipGlobResolution {
  const legacyShippedProvided = Array.isArray(projectConfig.shippedFilesGlobs)
  const legacyIgnoredProvided = Array.isArray(projectConfig.ignoredFilesGlobs)
  const hasLegacy = legacyShippedProvided || legacyIgnoredProvided
  const hasCompleteLegacy = legacyShippedProvided && legacyIgnoredProvided
  const hasGlobs = Boolean(projectConfig.globs)

  const legacyIsAllDefaults =
    hasCompleteLegacy &&
    Boolean(projectConfig.shippedFilesGlobs) &&
    Boolean(projectConfig.ignoredFilesGlobs) &&
    isLegacyShippedDefault(projectConfig.shippedFilesGlobs!) &&
    isLegacyIgnoredDefault(projectConfig.ignoredFilesGlobs!)

  // no explicit legacy and no explicit new globs => keep previous legacy defaults behavior
  if (!hasLegacy && !hasGlobs) {
    return {
      mode: 'legacy',
      warningMessage: undefined,
      patterns: LEGACY_DEFAULT_SHIPPED_FILES_GLOBS,
      ignore: LEGACY_DEFAULT_IGNORED_FILES_GLOBS,
    }
  }

  // no legacy values provided, but explicit new globs are set - use new mode without warning
  if (!hasLegacy && hasGlobs) {
    const {baseInclude, baseExclude, androidExclude, iosExclude} = resolvePlatformGlobs(projectConfig)
    const platformSpecificIgnore = getPlatformSpecificIgnore(platforms, iosExclude, androidExclude)

    return {
      mode: 'new',
      warningMessage: undefined,
      patterns: baseInclude,
      ignore: [...baseExclude, ...platformSpecificIgnore],
    }
  }

  // legacy values provided which are NOT defaults - so we must use them
  if (hasLegacy && !legacyIsAllDefaults) {
    return {
      mode: 'legacy',
      warningMessage: undefined,
      patterns: projectConfig.shippedFilesGlobs ?? LEGACY_DEFAULT_SHIPPED_FILES_GLOBS,
      ignore: projectConfig.ignoredFilesGlobs ?? LEGACY_DEFAULT_IGNORED_FILES_GLOBS,
    }
  }


  const {baseInclude, baseExclude, androidExclude, iosExclude} = resolvePlatformGlobs(projectConfig)
  const platformSpecificIgnore = getPlatformSpecificIgnore(platforms, iosExclude, androidExclude)

  return {
    mode: 'new',
    warningMessage: LEGACY_DEFAULTS_WARNING_MESSAGE,
    patterns: baseInclude,
    ignore: [...baseExclude, ...platformSpecificIgnore],
  }
}

// Gets the list of files to be zipped and uploaded
export async function getFilesToShip(
  projectConfig: ProjectConfig,
  platforms: Platform[],
  log: LogFunction,
  warnLog: LogFunction,
): Promise<string[]> {
  const {patterns, ignore, warningMessage} = resolveShipGlobConfig(projectConfig, platforms)

  if (warningMessage) warnLog(warningMessage)

  log('Retrieving file globs...')
  log('Finding files to include in zip...')
  const files = await fg(patterns, {dot: true, ignore})
  log(`Found ${files.length} files, adding to zip...`)
  return files
}

