import fg from 'fast-glob'

import {
  DEFAULT_PLATFORM_GLOBS,
  LEGACY_DEFAULT_IGNORED_FILES_GLOBS,
  LEGACY_DEFAULT_SHIPPED_FILES_GLOBS,
} from '../../constants/index.js'
import {type GlobRuleSet, type GlobsConfig, Platform, type ProjectConfig} from '../../types/index.js'

import type {LogFunction} from './types.js'

const WARN_LEARN_MORE = 'Learn more: https://shipth.is/docs/guides/controlling-uploaded-files'
const WARN_LEGACY_DEFAULT = 'Using legacy default globs - you should upgrade to the new globs. ' + WARN_LEARN_MORE
const WARN_MISSING_GLOBS = 'No file globs configured in shipthis.json; using defaults. ' + WARN_LEARN_MORE
const WARN_UPGRADE_GLOBS =
  'Using legacy custom file selection globs - you should upgrade to the new globs. ' + WARN_LEARN_MORE

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

// Merge `shipthis.json` globs with defaults so every tier has concrete include/exclude arrays.
function getSafeGlobsConfig(pc: ProjectConfig): GlobsConfig {
  return {
    android: {
      exclude: pc.globs?.android?.exclude ?? DEFAULT_PLATFORM_GLOBS.android.exclude,
      include: pc.globs?.android?.include ?? DEFAULT_PLATFORM_GLOBS.android.include,
    },
    base: {
      exclude: pc.globs?.base?.exclude ?? DEFAULT_PLATFORM_GLOBS.base.exclude,
      include: pc.globs?.base?.include ?? DEFAULT_PLATFORM_GLOBS.base.include,
    },
    ios: {
      exclude: pc.globs?.ios?.exclude ?? DEFAULT_PLATFORM_GLOBS.ios.exclude,
      include: pc.globs?.ios?.include ?? DEFAULT_PLATFORM_GLOBS.ios.include,
    },
  }
}

// Platform-specific rules applied only when shipping exactly one platform.
function getRulesetForPlatform(safe: GlobsConfig, platforms: Platform[]): GlobRuleSet {
  if (platforms.length !== 1) return {exclude: [], include: []}
  if (platforms[0] === Platform.IOS) return safe.ios
  if (platforms[0] === Platform.ANDROID) return safe.android
  return {exclude: [], include: []}
}

// Determines the final include/exclude rules for the given project config and platforms.
export function getFinalRuleset(projectConfig: ProjectConfig, platforms: Platform[]): GlobRuleSet & {warning?: string} {
  const {shippedFilesGlobs, ignoredFilesGlobs, globs} = projectConfig

  const legacyShippedProvided = Array.isArray(shippedFilesGlobs)
  const legacyIgnoredProvided = Array.isArray(ignoredFilesGlobs)
  const hasLegacy = legacyShippedProvided || legacyIgnoredProvided
  const hasCompleteLegacy = legacyShippedProvided && legacyIgnoredProvided
  const hasGlobs = Boolean(globs)

  // Merge `globs` defaults + optional platform slice into final include/exclude.
  const returnNewOrDefaults = (warning: string | undefined) => {
    const safe = getSafeGlobsConfig(projectConfig)
    const platformRuleset = getRulesetForPlatform(safe, platforms)
    return {
      warning,
      include: [...safe.base.include, ...platformRuleset.include],
      exclude: [...safe.base.exclude, ...platformRuleset.exclude],
    }
  }

  // No `shippedFilesGlobs` / `ignoredFilesGlobs`: always use new-format `globs` (defaults if absent).
  // Warn when `globs` is missing from shipthis.json; no warning when `globs` is explicitly set.
  if (!hasLegacy) {
    return returnNewOrDefaults(hasGlobs ? undefined : WARN_MISSING_GLOBS)
  }

  const legacyIsAllDefaults =
    hasCompleteLegacy &&
    Boolean(shippedFilesGlobs) &&
    Boolean(ignoredFilesGlobs) &&
    isLegacyShippedDefault(shippedFilesGlobs!) &&
    isLegacyIgnoredDefault(ignoredFilesGlobs!)

  // Legacy fields present and customized: must honor them; user should migrate to `globs`.
  if (!legacyIsAllDefaults) {
    return {
      warning: WARN_UPGRADE_GLOBS,
      include: shippedFilesGlobs ?? LEGACY_DEFAULT_SHIPPED_FILES_GLOBS,
      exclude: ignoredFilesGlobs ?? LEGACY_DEFAULT_IGNORED_FILES_GLOBS,
    }
  }

  // Legacy fields match historical defaults: treat as new-format globs but still warn to migrate.
  return returnNewOrDefaults(WARN_LEGACY_DEFAULT)
}

// Gets the list of files to be zipped and uploaded
export async function getFilesToShip(
  projectConfig: ProjectConfig,
  platforms: Platform[],
  log: LogFunction,
  warnLog: LogFunction,
): Promise<string[]> {
  const {include, exclude, warning} = getFinalRuleset(projectConfig, platforms)

  if (warning) warnLog(warning)

  log('Retrieving file globs...')
  log('Finding files to include in zip...')
  const files = await fg(include, {dot: true, ignore: exclude})
  log(`Found ${files.length} files, adding to zip...`)
  return files
}
