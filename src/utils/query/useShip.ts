import fs from 'node:fs'

import {Command} from '@oclif/core'
import {useMutation} from '@tanstack/react-query'
import fg from 'fast-glob'
import {v4 as uuid} from 'uuid'

import {getNewUploadTicket, getProject, startJobsFromUpload} from '@cli/api/index.js'
import {BaseCommand} from '@cli/baseCommands/index.js'
import {DEFAULT_IGNORED_FILES_GLOBS, DEFAULT_SHIPPED_FILES_GLOBS, cacheKeys} from '@cli/constants/index.js'
import {Job, Platform, ProjectConfig, ShipGameFlags, UploadDetails} from '@cli/types'
import {createZip, getCWDGitInfo, getFileHash, queryClient, uploadZip} from '@cli/utils/index.js'

// Takes the current command so we can get the project config
// This could be made more composable
interface ShipOptions {
  command: BaseCommand<typeof Command>
  log?: (message: string) => void
  shipFlags?: ShipGameFlags // If provided, will override command flags
}

function formatProgressLog(
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

export async function ship({command, log = () => {}, shipFlags}: ShipOptions): Promise<Job[]> {
  const commandFlags = command.getFlags() as ShipGameFlags
  const finalFlags = shipFlags || commandFlags
  const {verbose, useDemoCredentials} = finalFlags

  verbose && log('Fetching game config...')
  const projectConfig: ProjectConfig = await command.getProjectConfig()
  if (!projectConfig.project) throw new Error('No project found in project config')
  const project = await getProject(projectConfig.project.id)

  const projectUsesDemoCredentials = Boolean(project.details?.useDemoCredentials)
  const isUsingDemoCredentials = useDemoCredentials ?? projectUsesDemoCredentials ?? false

  const hasConfiguredIos = Boolean(project.details?.iosBundleId)
  const hasConfiguredAndroid = Boolean(project.details?.androidPackageName)
  const hasOnePlatformConfigured = hasConfiguredAndroid || hasConfiguredIos
  const isGo = finalFlags?.platform === 'go'

  if (!isGo && !isUsingDemoCredentials && !hasOnePlatformConfigured) {
    throw new Error(
      'No Android or iOS configuration found. Please run `shipthis game wizard android` or `shipthis game wizard ios` to configure your game.',
    )
  }

  verbose && log('Retrieving file globs...')
  const shippedFilesGlobs = projectConfig.shippedFilesGlobs || DEFAULT_SHIPPED_FILES_GLOBS
  const ignoredFilesGlobs = projectConfig.ignoredFilesGlobs || DEFAULT_IGNORED_FILES_GLOBS

  verbose && log('Finding files to include in zip...')
  const files = await fg(shippedFilesGlobs, {dot: true, ignore: ignoredFilesGlobs})

  verbose && log(`Found ${files.length} files, adding to zip...`)

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

  verbose && log('Requesting upload ticket...')
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

  verbose && log('Computing zip file hash...')
  const zipFileMd5 = await getFileHash(tmpZipFile)

  verbose && log('Cleaning up temporary zip file...')
  fs.unlinkSync(tmpZipFile)

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
  }

  log(`Upload complete`)

  verbose && log('Fetching Git info...')
  const gitInfo = await getCWDGitInfo()
  const uploadDetails: UploadDetails = {
    ...gitInfo,
    zipFileMd5,
  }

  verbose && log('Starting jobs from upload...')

  const startJobsOptions = {
    ...uploadDetails,
    platform: finalFlags.platform?.toUpperCase() as Platform,
    skipPublish: finalFlags.skipPublish,
    verbose: finalFlags.verbose,
    useDemoCredentials: isUsingDemoCredentials,
    gameEngineVersion: finalFlags.gameEngineVersion,
  }

  const jobs = await startJobsFromUpload(uploadTicket.id, startJobsOptions)

  verbose && log('Job submission complete.')

  if (jobs.length === 0) {
    throw new Error('No jobs were created. Please check your game configuration and try again.')
  }

  if (finalFlags?.follow) {
    log('Waiting for job to start...')
  }

  return jobs
}

export const useShip = () =>
  useMutation({
    mutationFn: ship,
    async onSuccess(data: Job[]) {
      queryClient.invalidateQueries({
        queryKey: cacheKeys.jobs({pageNumber: 0, projectId: data[0].project.id}),
      })
    },
  })
