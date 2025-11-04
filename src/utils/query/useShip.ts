import fs from 'node:fs'

import {Command} from '@oclif/core'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import fg from 'fast-glob'
import {v4 as uuid} from 'uuid'
import {ZipFile} from 'yazl'

import {getNewUploadTicket, getProject, startJobsFromUpload} from '@cli/api/index.js'
import {BaseCommand} from '@cli/baseCommands/index.js'
import {DEFAULT_IGNORED_FILES_GLOBS, DEFAULT_SHIPPED_FILES_GLOBS, cacheKeys} from '@cli/constants/index.js'
import {Job, Platform, ProjectConfig, ShipGameFlags, UploadDetails} from '@cli/types'
import {getCWDGitInfo, getFileHash, queryClient} from '@cli/utils/index.js'

// Takes the current command so we can get the project config
// This could be made more composable
interface ShipOptions {
  command: BaseCommand<typeof Command>
  log?: (message: string) => void
  shipFlags?: ShipGameFlags // If provided, will override command flags
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

  if (!isUsingDemoCredentials && !hasConfiguredAndroid && !hasConfiguredIos) {
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
  const zipFile = new ZipFile()
  for (const file of files) {
    zipFile.addFile(file, file)
  }

  const outputZipToFile = (zip: ZipFile, fileName: string) =>
    new Promise<void>((resolve) => {
      const outputStream = fs.createWriteStream(fileName)
      zip.outputStream.pipe(outputStream).on('close', () => resolve())
      zip.end()
    })

  const tmpZipFile = `${process.cwd()}/shipthis-${uuid()}.zip`
  log(`Creating zip file: ${tmpZipFile}`)
  await outputZipToFile(zipFile, tmpZipFile)

  verbose && log('Reading zip file buffer...')
  const zipBuffer = fs.readFileSync(tmpZipFile)
  const {size} = fs.statSync(tmpZipFile)

  verbose && log('Requesting upload ticket...')
  const uploadTicket = await getNewUploadTicket(projectConfig.project.id)

  log('Uploading zip file...')
  await axios.put(uploadTicket.url, zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-length': size,
    },
  })

  verbose && log('Fetching Git info...')
  const gitInfo = await getCWDGitInfo()
  verbose && log('Computing file hash...')
  const zipFileMd5 = await getFileHash(tmpZipFile)
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

  verbose && log('Cleaning up temporary zip file...')
  fs.unlinkSync(tmpZipFile)

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
