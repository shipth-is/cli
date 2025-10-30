import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {promises as readline} from 'node:readline'
import {fileURLToPath} from 'node:url'

import readlineSync from 'readline-sync'

import {JobStage, JobStatus, LogLevel, Platform, ScalarDict} from '@cli/types'

export * from './dates.js'
export * from './dictionary.js'
export * from './errors.js'
export * from './git.js'
export * from './godot.js'
export * from './help.js'
export * from './hooks/index.js'
export * from './query/index.js'

/**
 * Works the same way that git short commits are generated.
 * Used for most uuids on the backend where the short value should be unique within one users account.
 */
export function getShortUUID(originalUuid: string): string {
  return originalUuid.slice(0, 8)
}

export function getStageColor(stage: JobStage) {
  switch (stage) {
    case JobStage.SETUP: {
      return '#FFB3B3'
    } // pastel red

    case JobStage.CONFIGURE: {
      return '#FFD9B3'
    } // pastel orange

    case JobStage.EXPORT: {
      return '#FFFACD'
    } // pastel yellow

    case JobStage.BUILD: {
      return '#B3FFB3'
    } // pastel green

    case JobStage.PUBLISH: {
      return '#B3D9FF'
    } // pastel blue
  }
}

export function getMessageColor(level: LogLevel) {
  switch (level) {
    case LogLevel.INFO: {
      return 'white'
    }

    case LogLevel.WARN: {
      return 'yellow'
    }

    case LogLevel.ERROR: {
      return 'red'
    }
  }
}

export function getJobStatusColor(status: JobStatus) {
  switch (status) {
    case JobStatus.PENDING: {
      return 'yellow'
    }

    case JobStatus.PROCESSING: {
      return 'blue'
    }

    case JobStatus.COMPLETED: {
      return 'green'
    }

    case JobStatus.FAILED: {
      return 'red'
    }
  }
}

export async function getFileHash(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const rs = fs.createReadStream(filename)
    rs.on('error', reject)
    rs.on('data', (chunk) => hash.update(chunk))
    rs.on('end', () => resolve(hash.digest('hex')))
  })
}

/**
 * Validates a Semantic Version Number string.
 * https://dev.to/receter/parsing-semver-in-javascript-with-the-official-regex-4e0e
 */
export function isValidSemVer(versionString: string): boolean {
  const [semVer, major, minor, patch, prerelease, buildmetadata] =
    versionString.match(
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*))*))?(?:\+([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?$/,
    ) ?? []

  return Boolean(semVer)
}

/**
 * Converts the keys of an object to a more human-readable format.
 * This function takes an object with camelCase keys and transforms them into
 * space-separated words with the first letter of each word capitalized.
 * For example, 'someKey' becomes 'Some Key'. The function returns a new
 * object with the transformed keys, while preserving the original values.
 */
export function makeHumanReadable(rawObject: ScalarDict): ScalarDict {
  // Make the keys human readable
  const getLabel = (key: string) => {
    const words = key.split(/(?=[A-Z])/)
    return words
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ')
      .replaceAll('  ', ' ')
  }

  const withLabels = Object.entries(rawObject).reduce((acc: ScalarDict, [key, value]) => {
    acc[getLabel(key)] = value
    return acc
  }, {})

  return withLabels as ScalarDict
}

/**
 * Converts a platform to a human-readable name.
 */
export function getPlatformName(platform: Platform): string {
  switch (platform) {
    case Platform.IOS: {
      return 'iOS'
    }

    case Platform.ANDROID: {
      return 'Android'
    }

    case Platform.GO: {
      return 'Go'
    }

    default: {
      throw new Error(`Unknown platform: ${platform}`)
    }
  }
}

// Used when we don't want keyboard input to be visible
export async function getMaskedInput(message: string): Promise<string> {
  const password = readlineSync.question(message, {
    hideEchoBack: true, // This will hide the input as the user types
  })
  return password
}

// Prompts and closes input so we can use the masked input before / after
export async function getInput(message: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const answer = await rl.question(message)
  rl.close()
  return answer
}

/**
 * Generates a valid package name (bundle ID for iOS or package name for Android)
 * from a given game name by applying the most restrictive naming rules.
 *
 * Rules:
 * - Converts the game name to lowercase.
 * - Replaces spaces, hyphens, and underscores with dots.
 * - Removes any characters that are not alphanumeric or dots.
 * - Ensures no leading, trailing, or consecutive dots.
 * - If the name starts with a number, 'app.' is prepended to ensure it starts with a letter.
 * - Returns 'com.<normalized-game-name>' or null if the result is invalid.
 *
 * @note Generated by ChatGPT (GPT-4) on 2024-10-16.
 */
export function generatePackageName(gameName: string): null | string {
  let normalizedGameName = gameName.trim().toLowerCase()
  normalizedGameName = normalizedGameName.replaceAll(/[\s_\-]+/g, '.')
  normalizedGameName = normalizedGameName.replaceAll(/[^\d.a-z]/g, '')
  normalizedGameName = normalizedGameName.replaceAll(/\.+/g, '.')
  normalizedGameName = normalizedGameName.replace(/^\./, '').replace(/\.$/, '')

  if (/^\d/.test(normalizedGameName)) {
    normalizedGameName = 'app.' + normalizedGameName
  }

  const prefix = 'com.'

  if (normalizedGameName === '') {
    return null
  }

  return prefix + normalizedGameName
}

// __dirname and import.meta.dirname are not things :(
// This saves 2 imports
export function scriptDir(importMeta: ImportMeta): string {
  const filename = fileURLToPath(importMeta.url)
  const dirname = path.dirname(filename)
  return dirname
}
