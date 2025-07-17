import {getNewUploadTicket, startJobsFromUpload} from '@cli/api/index.js'
import {BaseCommand} from '@cli/baseCommands/index.js'
import {DEFAULT_IGNORED_FILES_GLOBS, DEFAULT_SHIPPED_FILES_GLOBS, cacheKeys} from '@cli/constants/index.js'
import {Job, Platform, ProjectConfig, ShipGameFlags, UploadDetails} from '@cli/types'
import {getCWDGitInfo, getFileHash, queryClient} from '@cli/utils/index.js'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import fg from 'fast-glob'
import fs from 'node:fs'
import {v4 as uuid} from 'uuid'
import yazl from 'yazl'

// Takes the current command so we can get the project config
// TODO: refactor to make more composable
interface ShipOptions {
  command: BaseCommand<any>
  log?: (message: string) => void
  shipFlags?: ShipGameFlags // If provided, will override command flags
}

export async function ship({command, log = () => {}, shipFlags}: ShipOptions): Promise<Job[]> {
  log('Fetching game config...')
  const projectConfig: ProjectConfig = await command.getProjectConfig()

  if (!projectConfig.project) throw new Error('No project found in project config')

  const hasConfiguredIos = Boolean(projectConfig.project.details?.iosBundleId)
  const hasConfiguredAndroid = Boolean(projectConfig.project.details?.androidPackageName)

  if (!hasConfiguredAndroid && !hasConfiguredIos) {
    throw new Error(
      'No Android or iOS configuration found. Please run `shipthis game wizard android` or `shipthis game wizard ios` to configure your game.',
    )
  }

  log('Retrieving file globs...')
  const shippedFilesGlobs = projectConfig.shippedFilesGlobs || DEFAULT_SHIPPED_FILES_GLOBS
  const ignoredFilesGlobs = projectConfig.ignoredFilesGlobs || DEFAULT_IGNORED_FILES_GLOBS

  log('Finding files to include in zip...')
  const files = await fg(shippedFilesGlobs, {dot: true, ignore: ignoredFilesGlobs})

  log(`Found ${files.length} files, adding to zip...`)
  const zipFile = new yazl.ZipFile()
  for (const file of files) {
    zipFile.addFile(file, file)
  }

  const outputZipToFile = (zip: yazl.ZipFile, fileName: string) =>
    new Promise<void>((resolve) => {
      const outputStream = fs.createWriteStream(fileName)
      zip.outputStream.pipe(outputStream).on('close', () => resolve())
      zip.end()
    })

  const tmpZipFile = `${process.cwd()}/shipthis-${uuid()}.zip`
  log(`Creating zip file: ${tmpZipFile}`)
  await outputZipToFile(zipFile, tmpZipFile)

  log('Reading zip file buffer...')
  const zipBuffer = fs.readFileSync(tmpZipFile)
  const {size} = fs.statSync(tmpZipFile)

  log('Requesting upload ticket...')
  const uploadTicket = await getNewUploadTicket(projectConfig.project.id)

  log('Uploading zip file...')
  await axios.put(uploadTicket.url, zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-length': size,
    },
  })

  log('Fetching Git info...')
  const gitInfo = await getCWDGitInfo()
  log('Computing file hash...')
  const zipFileMd5 = await getFileHash(tmpZipFile)
  const uploadDetails: UploadDetails = {
    ...gitInfo,
    zipFileMd5,
  }

  log('Starting jobs from upload...')

  const finalFlags = shipFlags || (command.getFlags() as ShipGameFlags)

  const startJobsOptions = {
    ...uploadDetails,
    platform: finalFlags.platform?.toUpperCase() as Platform,
    skipPublish: finalFlags.skipPublish,
  }

  const jobs = await startJobsFromUpload(uploadTicket.id, startJobsOptions)

  log('Cleaning up temporary zip file...')
  fs.unlinkSync(tmpZipFile)

  log('Job submission complete.')

  if (jobs.length === 0) {
    throw new Error('No jobs were created. Please check your game configuration and try again.')
  }

  return jobs
}

export const useShip = () => useMutation({
    mutationFn: ship,
    async onSuccess(data: Job[]) {
      queryClient.invalidateQueries({
        queryKey: cacheKeys.jobs({pageNumber: 0, projectId: data[0].project.id}),
      })
    },
  })
