import fs from 'node:fs'

import {v4 as uuid} from 'uuid'

import {getProject, startJobsFromUpload} from '@cli/api/index.js'
import type {Job, Platform, ProjectConfig, ShipGameFlags, UploadDetails} from '@cli/types'
import {detectGodotVersion, getGodotVersionDrift} from '@cli/utils/godot.js'
import {getCWDGitInfo, getFileHash} from '@cli/utils/index.js'

import {getFilesToShip} from './glob.js'
import {MULTIPART_MIN_SIZE, multipartUpload} from './multipartUpload.js'
import type {ShipOptions} from './types.js'
import {MAX_SINGLE_UPLOAD_SIZE, type ProgressData, singleUpload} from './upload.js'
import {formatProgressLog, getPlatforms} from './utils.js'
import {createZip} from './zip.js'

const ERR_NOT_CONFIGURED = 'No Android or iOS configuration found. Please run `shipthis game wizard android` or `shipthis game wizard ios` to configure your game.'

const getVersionMismatch = (detected: string, configured: string) =>
  `Your project.godot targets Godot ${detected}, but this game builds with Godot ${configured}.`

// The commands go on their own lines so they stand out - this.error() and console.warn
// both preserve newlines.
const getVersionFixHint = (detected: string) =>
  `To build with Godot ${detected}, update the game:\n\n` +
  `  shipthis game details --gameEngineVersion ${detected} --force\n\n` +
  `Or ship once without changing the game:\n\n` +
  `  shipthis game ship --gameEngineVersion ${detected}`

const getMajorDriftError = (detected: string, configured: string) =>
  `${getVersionMismatch(detected, configured)}\n` +
  `Building a Godot ${detected} project with Godot ${configured} does not produce a working game, ` +
  `so this ship has been stopped before building.\n\n` +
  getVersionFixHint(detected)

const getMinorDriftWarning = (detected: string, configured: string) =>
  `${getVersionMismatch(detected, configured)}\n\n` + getVersionFixHint(detected)

const getTooLargeForSingleUploadError = (size: number) =>
  `This zip is ${(size / 1000 / 1000 / 1000).toFixed(1)}GB. ` +
  `One request can send at most ${MAX_SINGLE_UPLOAD_SIZE / 1000 / 1000 / 1000}GB.\n\n` +
  `Remove --skipMultipart to upload it in parts.`

// Main function to ship the game
export async function ship({command, log, warnLog, shipFlags}: ShipOptions): Promise<Job[]> {
  const commandFlags = command.getFlags() as ShipGameFlags
  const finalFlags = shipFlags || commandFlags
  const {useDemoCredentials} = finalFlags

  const verbose = !!finalFlags.verbose || finalFlags.dryRun

  // Verbose logging function
  const vlog = verbose ? log : () => {}

  if (finalFlags.dryRun) {
    log('Dry run - listing files that would be shipped and applying verbose logging...')
  }

  vlog('Fetching game config...')
  const projectConfig: ProjectConfig = await command.getProjectConfig()
  if (!projectConfig.project) throw new Error('No project found in project config')
  const project = await getProject(projectConfig.project.id)

  // gameEngineVersion is detected once at create time and drifts when the project is
  // upgraded. A major drift does not build correctly, so stop before we publish one.
  if (!finalFlags.gameEngineVersion) {
    const detected = detectGodotVersion()
    const configured = project.details?.gameEngineVersion
    const drift = detected && configured ? getGodotVersionDrift(detected, configured) : null
    if (drift === 'major') throw new Error(getMajorDriftError(detected!, configured!))
    if (drift === 'minor') warnLog(getMinorDriftWarning(detected!, configured!))
  }

  const projectUsesDemoCredentials = Boolean(project.details?.useDemoCredentials)
  const isUsingDemoCredentials = useDemoCredentials ?? projectUsesDemoCredentials ?? false

  const hasConfiguredIos = Boolean(project.details?.iosBundleId)
  const hasConfiguredAndroid = Boolean(project.details?.androidPackageName)

  if (!isUsingDemoCredentials && !hasConfiguredAndroid && !hasConfiguredIos) {
    throw new Error(ERR_NOT_CONFIGURED)
  }

  const platforms = await getPlatforms(project, finalFlags, vlog)
  const files = await getFilesToShip(projectConfig, platforms, vlog, warnLog)

  if (finalFlags.dryRun) {
    log(`Dry run - would ship ${files.length} files:`)
    for (const file of files) {
      log(`  ${file}`)
    }
    // Simply returning here does not work.
    process.exit(0)
    return []
  }

  const tmpZipFileName = `shipthis-${uuid()}.zip`
  const tmpZipFile = `${process.cwd()}/${tmpZipFileName}`
  log(`Creating zip file: ${tmpZipFileName}`)
  await createZip({
    files,
    outputPath: tmpZipFile,
    onProgress: (data) => {
      log(formatProgressLog('Zipping', data, 'writtenBytes', 'estimatedTotalBytes', true))
    },
  })

  let zipFileMd5 = ''
  let uploadTicketId = ''

  try {
    const {size} = fs.statSync(tmpZipFile)

    log('Uploading zip file...')
    const uploadProps = {
      filePath: tmpZipFile,
      projectId: projectConfig.project.id,
      vlog,
      zipSize: size,
      onProgress: (data: ProgressData) => {
        log(formatProgressLog('Uploading', data, 'loadedBytes', 'totalBytes', false))
      },
    }

    // A small zip goes up in one request. Splitting it buys nothing.
    const useMultipart = size >= MULTIPART_MIN_SIZE && !finalFlags.skipMultipart

    if (!useMultipart && size > MAX_SINGLE_UPLOAD_SIZE) {
      throw new Error(getTooLargeForSingleUploadError(size))
    }

    uploadTicketId = useMultipart ? await multipartUpload(uploadProps) : await singleUpload(uploadProps)

    vlog('Computing zip file hash...')
    zipFileMd5 = await getFileHash(tmpZipFile)
  } finally {
    if (fs.existsSync(tmpZipFile)) {
      try {
        vlog('Cleaning up temporary zip file...')
        fs.unlinkSync(tmpZipFile)
      } catch (err) {
        if (warnLog) {
          warnLog(`Failed to remove temporary zip file: ${String(err)}`)
        }
      }
    }
  }

  log(`Upload complete`)

  vlog('Fetching Git info...')
  const gitInfo = await getCWDGitInfo()
  const uploadDetails: UploadDetails = {
    ...gitInfo,
    zipFileMd5,
  }

  vlog('Starting jobs from upload...')

  const startJobsOptions = {
    ...uploadDetails,
    platform: finalFlags.platform?.toUpperCase() as Platform,
    skipPublish: finalFlags.skipPublish,
    verbose: finalFlags.verbose,
    useDemoCredentials: isUsingDemoCredentials,
    gameEngineVersion: finalFlags.gameEngineVersion,
  }

  const jobs = await startJobsFromUpload(uploadTicketId, startJobsOptions)

  vlog('Job submission complete.')

  if (jobs.length === 0) {
    throw new Error('No jobs were created. Please check your game configuration and try again.')
  }

  if (finalFlags?.follow) {
    log('Waiting for job to start...')
  }

  return jobs
}
