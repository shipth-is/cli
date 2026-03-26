import fs from 'node:fs'

import {v4 as uuid} from 'uuid'

import {getNewUploadTicket, getProject, startJobsFromUpload} from '@cli/api/index.js'
import {Job, Platform, ProjectConfig, ShipGameFlags, UploadDetails} from '@cli/types'
import {getCWDGitInfo, getFileHash} from '@cli/utils/index.js'

import {getFilesToShip} from './glob.js'
import {ShipOptions} from './types.js'
import {uploadZip} from './upload.js'
import {formatProgressLog, getPlatforms} from './utils.js'
import {createZip} from './zip.js'

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

  const projectUsesDemoCredentials = Boolean(project.details?.useDemoCredentials)
  const isUsingDemoCredentials = useDemoCredentials ?? projectUsesDemoCredentials ?? false

  const hasConfiguredIos = Boolean(project.details?.iosBundleId)
  const hasConfiguredAndroid = Boolean(project.details?.androidPackageName)

  if (!isUsingDemoCredentials && !hasConfiguredAndroid && !hasConfiguredIos) {
    throw new Error(
      'No Android or iOS configuration found. Please run `shipthis game wizard android` or `shipthis game wizard ios` to configure your game.',
    )
  }

  const platforms = await getPlatforms(project, finalFlags, vlog)
  const files = await getFilesToShip(projectConfig, platforms, vlog, warnLog)

  if (finalFlags.dryRun) {
    log(`Dry run - would ship ${files.length} files:`)
    for (const file of files) {
      log(`  ${file}`)
    }
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

  const {size} = fs.statSync(tmpZipFile)

  vlog('Requesting upload ticket...')
  const uploadTicket = await getNewUploadTicket(projectConfig.project.id)

  log('Uploading zip file...')
  const zipStream = fs.createReadStream(tmpZipFile)

  const response = await uploadZip({
    url: uploadTicket.url,
    zipStream,
    zipSize: size,
    onProgress: (data) => {
      log(formatProgressLog('Uploading', data, 'loadedBytes', 'totalBytes', false))
    },
  })

  vlog('Computing zip file hash...')
  const zipFileMd5 = await getFileHash(tmpZipFile)

  vlog('Cleaning up temporary zip file...')
  fs.unlinkSync(tmpZipFile)

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
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

  const jobs = await startJobsFromUpload(uploadTicket.id, startJobsOptions)

  vlog('Job submission complete.')

  if (jobs.length === 0) {
    throw new Error('No jobs were created. Please check your game configuration and try again.')
  }

  if (finalFlags?.follow) {
    log('Waiting for job to start...')
  }

  return jobs
}
