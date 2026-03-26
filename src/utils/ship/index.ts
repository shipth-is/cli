import fs from 'node:fs'

import fg from 'fast-glob'
import {v4 as uuid} from 'uuid'

import {getNewUploadTicket, getProject, startJobsFromUpload} from '@cli/api/index.js'
import {DEFAULT_IGNORED_FILES_GLOBS, DEFAULT_SHIPPED_FILES_GLOBS} from '@cli/constants/index.js'
import {Job, Platform, ProjectConfig, ShipGameFlags, UploadDetails} from '@cli/types'
import {getCWDGitInfo, getFileHash} from '@cli/utils/index.js'

import {LogFunction, ShipOptions} from './types.js'
import {uploadZip} from './upload.js'
import {formatProgressLog, getPlatforms} from './utils.js'
import {createZip} from './zip.js'

// Gets the list of files to be zipped and uploaded
export async function getFilesToShip(
  projectConfig: ProjectConfig,
  platforms: Platform[], // TODO: use this
  log: LogFunction,
): Promise<string[]> {
  //
  log('Retrieving file globs...')
  const shippedFilesGlobs = projectConfig.shippedFilesGlobs || DEFAULT_SHIPPED_FILES_GLOBS
  const ignoredFilesGlobs = projectConfig.ignoredFilesGlobs || DEFAULT_IGNORED_FILES_GLOBS

  log('Finding files to include in zip...')
  const files = await fg(shippedFilesGlobs, {dot: true, ignore: ignoredFilesGlobs})

  log(`Found ${files.length} files, adding to zip...`)
  return files
}

// Main function to ship the game
export async function ship({command, log, shipFlags}: ShipOptions): Promise<Job[]> {
  const commandFlags = command.getFlags() as ShipGameFlags
  const finalFlags = shipFlags || commandFlags
  const {useDemoCredentials} = finalFlags

  const verbose = !!finalFlags.verbose || finalFlags.dryRun

  const logFn = log ? log : () => {}
  const vlogFn = verbose ? logFn : () => {}

  if (finalFlags.dryRun) {
    logFn('Dry run - listing files that would be shipped and applying verbose logging...')
  }

  vlogFn('Fetching game config...')
  const projectConfig: ProjectConfig = await command.getProjectConfig()
  if (!projectConfig.project) throw new Error('No project found in project config')
  const project = await getProject(projectConfig.project.id)

  const projectUsesDemoCredentials = Boolean(project.details?.useDemoCredentials)
  const isUsingDemoCredentials = useDemoCredentials ?? projectUsesDemoCredentials ?? false

  const hasConfiguredIos = Boolean(project.details?.iosBundleId)
  const hasConfiguredAndroid = Boolean(project.details?.androidPackageName)

  if (!isUsingDemoCredentials && !hasConfiguredAndroid && !hasConfiguredIos) {
    throw new Error(
      'No Android or iOS configuration found. Please run `shipthis game wizard android` or `shipthis game wizard ios` to configure your game.',
    )
  }

  const platforms = await getPlatforms(project, finalFlags, vlogFn)
  const files = await getFilesToShip(projectConfig, platforms, vlogFn)

  if (finalFlags.dryRun) {
    logFn(`Dry run - would ship ${files.length} files:`)
    for (const file of files) {
      logFn(`  ${file}`)
    }
    process.exit(0)
    return []
  }

  const tmpZipFileName = `shipthis-${uuid()}.zip`
  const tmpZipFile = `${process.cwd()}/${tmpZipFileName}`
  logFn(`Creating zip file: ${tmpZipFileName}`)
  await createZip({
    files,
    outputPath: tmpZipFile,
    onProgress: (data) => {
      logFn(formatProgressLog('Zipping', data, 'writtenBytes', 'estimatedTotalBytes', true))
    },
  })

  const {size} = fs.statSync(tmpZipFile)

  vlogFn('Requesting upload ticket...')
  const uploadTicket = await getNewUploadTicket(projectConfig.project.id)

  logFn('Uploading zip file...')
  const zipStream = fs.createReadStream(tmpZipFile)

  const response = await uploadZip({
    url: uploadTicket.url,
    zipStream,
    zipSize: size,
    onProgress: (data) => {
      logFn(formatProgressLog('Uploading', data, 'loadedBytes', 'totalBytes', false))
    },
  })

  vlogFn('Computing zip file hash...')
  const zipFileMd5 = await getFileHash(tmpZipFile)

  vlogFn('Cleaning up temporary zip file...')
  fs.unlinkSync(tmpZipFile)

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
  }

  logFn(`Upload complete`)

  vlogFn('Fetching Git info...')
  const gitInfo = await getCWDGitInfo()
  const uploadDetails: UploadDetails = {
    ...gitInfo,
    zipFileMd5,
  }

  vlogFn('Starting jobs from upload...')

  const startJobsOptions = {
    ...uploadDetails,
    platform: finalFlags.platform?.toUpperCase() as Platform,
    skipPublish: finalFlags.skipPublish,
    verbose: finalFlags.verbose,
    useDemoCredentials: isUsingDemoCredentials,
    gameEngineVersion: finalFlags.gameEngineVersion,
  }

  const jobs = await startJobsFromUpload(uploadTicket.id, startJobsOptions)

  vlogFn('Job submission complete.')

  if (jobs.length === 0) {
    throw new Error('No jobs were created. Please check your game configuration and try again.')
  }

  if (finalFlags?.follow) {
    logFn('Waiting for job to start...')
  }

  return jobs
}
