import {v4 as uuid} from 'uuid'
import axios from 'axios'
import fg from 'fast-glob'
import fs from 'fs'
import yazl from 'yazl'
import {useMutation} from '@tanstack/react-query'

import {DEFAULT_SHIPPED_FILES_GLOBS, DEFAULT_IGNORED_FILES_GLOBS, cacheKeys} from '@cli/constants/index.js'
import {getCWDGitInfo, getFileHash, queryClient} from '@cli/utils/index.js'
import {getNewUploadTicket, startJobsFromUpload} from '@cli/api/index.js'
import {Job, Platform, ProjectConfig, UploadDetails} from '@cli/types'
import {BaseCommand} from '@cli/baseCommands/index.js'

// Takes the current command so we can get the project config
// TODO: refactor to make more composable
interface ShipOptions {
  command: BaseCommand<any>
  log?: (message: string) => void
}

type ShipGameFlags = {
  platform?: 'android' | 'ios'
  skipPublish?: boolean
  download?: string
}

export async function ship({command, log = () => {}}: ShipOptions): Promise<Job[]> {
  log('Fetching project config...')
  const projectConfig: ProjectConfig = await command.getProjectConfig()

  if (!projectConfig.project) throw new Error('No project found in project config')

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
      'Content-length': size,
      'Content-Type': 'application/zip',
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

  const commandFlags = command.getFlags() as ShipGameFlags

  const startJobsOptions = {
    ...uploadDetails,
    skipPublish: commandFlags.skipPublish,
    platform: commandFlags.platform?.toUpperCase() as Platform,
  }

  const jobs = await startJobsFromUpload(uploadTicket.id, startJobsOptions)

  log('Cleaning up temporary zip file...')
  fs.unlinkSync(tmpZipFile)

  log('Job submission complete.')
  return jobs
}

export const useShip = () => {
  return useMutation({
    mutationFn: ship,
    onSuccess: async (data: Job[]) => {
      queryClient.invalidateQueries({
        queryKey: cacheKeys.jobs({projectId: data[0].project.id, pageNumber: 0}),
      })
    },
  })
}
