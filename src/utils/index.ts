import crypto from 'crypto'
import fs from 'fs'

import {JobStage, JobStatus, LogLevel, ScalarDict} from '@cli/types.js'

export * from './hooks/index.js'
export * from './query/index.js'
export * from './dates.js'
export * from './dictionary.js'
export * from './git.js'
export * from './godot.js'

export function getShortUUID(originalUuid: string): string {
  // A short git commit hash is an abbreviation of the hash to the first 7 characters
  // It should be unique within the users account
  return originalUuid.slice(0, 8)
}

export function getStageColor(stage: JobStage) {
  switch (stage) {
    case JobStage.SETUP:
      return '#FFB3B3' // pastel red
    case JobStage.EXPORT:
      return '#FFD9B3' // pastel orange
    case JobStage.CONFIGURE:
      return '#FFFACD' // pastel yellow
    case JobStage.BUILD:
      return '#B3FFB3' // pastel green
    case JobStage.PUBLISH:
      return '#B3D9FF' // pastel blue
  }
}

export function getMessageColor(level: LogLevel) {
  switch (level) {
    case LogLevel.INFO:
      return 'white'
    case LogLevel.WARN:
      return 'yellow'
    case LogLevel.ERROR:
      return 'red'
  }
}

export function getJobStatusColor(status: JobStatus) {
  switch (status) {
    case JobStatus.PENDING:
      return 'yellow'
    case JobStatus.PROCESSING:
      return 'blue'
    case JobStatus.COMPLETED:
      return 'green'
    case JobStatus.FAILED:
      return 'red'
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

export function isValidSemVer(versionString: string): boolean {
  // https://dev.to/receter/parsing-semver-in-javascript-with-the-official-regex-4e0e
  const [semVer, major, minor, patch, prerelease, buildmetadata] =
    versionString.match(
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
    ) ?? []

  return !!semVer
}

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
