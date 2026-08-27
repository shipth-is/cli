import fs from 'node:fs'

import {SUPPORTED_GODOT_VERSIONS} from '@cli/constants/godot.js'

// Docs pages the errors point at. An error without a page carries no ref.
// ShipThis has no page on the two identifier formats, so those point at the platform that
// sets the rule. Each link states the rule the message reports, and nothing more.
const ANDROID_APPLICATION_ID_DOCS = 'https://developer.android.com/build/configure-app-module#set-application-id'
const APPLE_BUNDLE_ID_DOCS =
  'https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleidentifier'
const GLASS_DOCS = 'https://shipth.is/docs/guides/liquid-glass'
const GODOT_VERSIONING_DOCS = 'https://shipth.is/docs/guides/godot-versioning'
const VERSIONING_DOCS = 'https://shipth.is/docs/guides/versioning'

export const MAX_GAME_NAME_LENGTH = 64
export const MIN_BUILD_NUMBER = 1
// The largest value Google Play accepts as a versionCode
export const MAX_BUILD_NUMBER = 2_100_000_000

/**
 * A validation failure. The fields match the options `this.error()` takes, so a caller
 * passes them straight through and oclif prints the suggestions and the reference.
 */
export interface DetailsValidationError {
  message: string
  ref?: string
  suggestions?: string[]
}

/** The details fields this module checks. Every other field passes through unchecked. */
export interface DetailsValues {
  androidPackageName?: string
  buildNumber?: number
  gameEngine?: string
  gameEngineVersion?: string
  iosBundleId?: string
  liquidGlassIconPath?: string
  name?: string
  semanticVersion?: string
}

// Detection only ever produces a major.minor, and a user can add a patch (4.2.1).
const GODOT_VERSION_SHAPE = /^\d+\.\d+(\.\d+)?$/
// Three numbers and nothing else. A part has no leading zero.
const STORE_VERSION_SHAPE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/
const ANDROID_SEGMENT_SHAPE = /^[A-Za-z][\dA-Za-z_]*$/
const IOS_SEGMENT_SHAPE = /^[\dA-Za-z-]+$/

/**
 * True when the body of GET /godot/versions is a bare array of major.minor strings.
 * The answer decides which versions the CLI accepts, so a body of another shape - an HTML
 * error page from a proxy, an empty array - has to fall back rather than reject everything.
 */
export function isVersionList(data: unknown): data is string[] {
  return Array.isArray(data) && data.length > 0 && data.every((item) => typeof item === 'string' && /^\d+\.\d+$/.test(item))
}

/** True when ShipThis has export templates for this Godot version. */
export function isSupportedGodotVersion(version: string, versions: string[] = SUPPORTED_GODOT_VERSIONS): boolean {
  if (!GODOT_VERSION_SHAPE.test(version.trim())) return false
  const [major, minor] = version.trim().split('.')
  return versions.includes(`${major}.${minor}`)
}

/**
 * Reduces a near miss to a supported version, so the error can suggest it.
 * "v4.2" and "4.2-stable" both reduce to "4.2". Returns null when nothing sensible comes out.
 */
function getSuggestedGodotVersion(value: string, versions: string[]): null | string {
  const match = value.trim().replace(/^v/i, '').match(/^(\d+)\.(\d+)/)
  if (!match) return null
  const majorMinor = `${Number(match[1])}.${Number(match[2])}`
  return versions.includes(majorMinor) ? majorMinor : null
}

/** True when the version is three numbers, which is what the App Store accepts. */
export function isValidStoreVersion(version: string): boolean {
  return STORE_VERSION_SHAPE.test(version.trim())
}

/** Reduces "1.2" to "1.2.0" and "1.2.3-beta" to "1.2.3". Returns null when nothing comes out. */
function getSuggestedStoreVersion(value: string): null | string {
  const match = value
    .trim()
    .replace(/^v/i, '')
    .match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/)
  if (!match) return null
  const [, major, minor = '0', patch = '0'] = match
  const candidate = `${Number(major)}.${Number(minor)}.${Number(patch)}`
  return isValidStoreVersion(candidate) ? candidate : null
}

/**
 * True when the package name is one Google Play accepts as an application ID.
 * Java and Gradle may enforce other requirements which are not checked here.
 */
export function isValidAndroidPackageName(packageName: string): boolean {
  const segments = packageName.trim().split('.')
  if (segments.length < 2) return false
  return segments.every((segment) => ANDROID_SEGMENT_SHAPE.test(segment))
}

/** True when the bundle ID is one Apple accepts. */
export function isValidIosBundleId(bundleId: string): boolean {
  const segments = bundleId.trim().split('.')
  if (segments.length < 2) return false
  return segments.every((segment) => IOS_SEGMENT_SHAPE.test(segment))
}

function validateName(name: string): DetailsValidationError | null {
  if (name.trim().length === 0) return {message: 'The game name cannot be empty.'}
  if (name.trim().length > MAX_GAME_NAME_LENGTH) {
    return {
      message: `The game name is ${name.trim().length} characters. The limit is ${MAX_GAME_NAME_LENGTH}.`,
    }
  }

  return null
}

function validateGameEngine(gameEngine: string): DetailsValidationError | null {
  if (gameEngine.trim().toLowerCase() === 'godot') return null
  return {
    message: `Game engine "${gameEngine}" is not supported. ShipThis builds Godot games.`,
    suggestions: ['--gameEngine godot'],
  }
}

function validateGameEngineVersion(version: string, versions: string[]): DetailsValidationError | null {
  if (isSupportedGodotVersion(version, versions)) return null

  const suggested = getSuggestedGodotVersion(version, versions)
  return {
    message:
      `"${version}" is not a Godot version that ShipThis builds.\n` +
      `Supported versions: ${versions.join(', ')}. ` +
      `You can also pin a patch, such as 4.2.1.`,
    ref: GODOT_VERSIONING_DOCS,
    ...(suggested && {suggestions: [`--gameEngineVersion ${suggested}`]}),
  }
}

function validateSemanticVersion(version: string): DetailsValidationError | null {
  if (isValidStoreVersion(version)) return null

  const hasSuffix = /[+-]/.test(version.trim())
  const suggested = getSuggestedStoreVersion(version)
  return {
    message:
      `"${version}" is not a valid semantic version. Use three numbers, such as 1.2.3.` +
      (hasSuffix ? '\nThe App Store rejects a prerelease or build metadata suffix, such as -beta or +001.' : ''),
    ref: VERSIONING_DOCS,
    ...(suggested && {suggestions: [`--semanticVersion ${suggested}`]}),
  }
}

function validateBuildNumber(buildNumber: number): DetailsValidationError | null {
  if (Number.isInteger(buildNumber) && buildNumber >= MIN_BUILD_NUMBER && buildNumber <= MAX_BUILD_NUMBER) return null

  return {
    message:
      `The build number must be a whole number from ${MIN_BUILD_NUMBER} to ${MAX_BUILD_NUMBER}.\n` +
      `${MAX_BUILD_NUMBER} is the largest value Google Play accepts as a versionCode.`,
    ref: VERSIONING_DOCS,
  }
}

function validateAndroidPackageName(packageName: string): DetailsValidationError | null {
  if (isValidAndroidPackageName(packageName)) return null

  return {
    message:
      `"${packageName}" is not a valid Android package name.\n` +
      'Use two or more segments, such as com.mystudio.mygame. Each segment starts with a letter and holds letters, numbers, and underscores only.',
    ref: ANDROID_APPLICATION_ID_DOCS,
  }
}

function validateIosBundleId(bundleId: string): DetailsValidationError | null {
  if (isValidIosBundleId(bundleId)) return null

  return {
    message:
      `"${bundleId}" is not a valid iOS bundle ID.\n` +
      'Apple accepts letters, numbers, and hyphens only. ShipThis expects the usual reverse-DNS form, such as com.mystudio.mygame.' +
      (bundleId.includes('_') ? '\nAn underscore is not allowed.' : ''),
    ref: APPLE_BUNDLE_ID_DOCS,
  }
}

function validateLiquidGlassIconPath(iconPath: string): DetailsValidationError | null {
  const trimmed = iconPath.trim()
  if (trimmed.length === 0) return null // An empty value clears the field

  if (!/\.icon$/i.test(trimmed)) {
    return {
      message: `"${iconPath}" is not a Liquid Glass icon. The path must name a .icon folder.`,
      ref: GLASS_DOCS,
    }
  }

  if (!fs.existsSync(trimmed)) {
    return {message: `Liquid Glass icon not found: ${iconPath}`, ref: GLASS_DOCS}
  }

  if (!fs.statSync(trimmed).isDirectory()) {
    return {message: `"${iconPath}" is a file. A Liquid Glass icon is a folder.`, ref: GLASS_DOCS}
  }

  return null
}

/**
 * Checks the details values a user gave. Returns the first problem, or null when they all
 * pass. A field that is undefined is skipped, so a caller passes its whole flags object.
 * The order below fixes which field reports first when a command sets several at once.
 *
 * `versions` holds the Godot versions the build server has templates for. A caller that has
 * asked the server passes its answer. The built-in list is the fallback.
 */
export function validateDetailsValues(
  values: DetailsValues,
  versions: string[] = SUPPORTED_GODOT_VERSIONS,
): DetailsValidationError | null {
  const {
    androidPackageName,
    buildNumber,
    gameEngine,
    gameEngineVersion,
    iosBundleId,
    liquidGlassIconPath,
    name,
    semanticVersion,
  } = values

  const errors = [
    name === undefined ? null : validateName(name),
    gameEngine === undefined ? null : validateGameEngine(gameEngine),
    gameEngineVersion === undefined ? null : validateGameEngineVersion(gameEngineVersion, versions),
    semanticVersion === undefined ? null : validateSemanticVersion(semanticVersion),
    buildNumber === undefined ? null : validateBuildNumber(buildNumber),
    androidPackageName === undefined ? null : validateAndroidPackageName(androidPackageName),
    iosBundleId === undefined ? null : validateIosBundleId(iosBundleId),
    liquidGlassIconPath === undefined ? null : validateLiquidGlassIconPath(liquidGlassIconPath),
  ]

  return errors.find((error) => error !== null) ?? null
}

