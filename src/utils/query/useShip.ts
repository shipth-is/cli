import {v4 as uuid} from 'uuid'
import axios from 'axios'
import fg from 'fast-glob'
import fs from 'fs'
import yazl from 'yazl'
import {useMutation} from '@tanstack/react-query'

import {DEFAULT_SHIPPED_FILES_GLOBS, DEFAULT_IGNORED_FILES_GLOBS, cacheKeys} from '@cli/constants/index.js'
import {getCWDGitInfo, getFileHash, queryClient} from '@cli/utils/index.js'
import {getNewUploadTicket, startJobsFromUpload} from '@cli/api/index.js'
import {Job, ProjectConfig, UploadDetails} from '@cli/types'
import {BaseCommand} from '@cli/baseCommands/index.js'

// Takes the current command so we can get the project config
// TODO: refactor to make more composable
export async function ship(command: BaseCommand<any>): Promise<Job[]> {
  const projectConfig: ProjectConfig = await command.getProjectConfig()

  if (!projectConfig.project) throw new Error('No project found in project config')

  const shippedFilesGlobs = projectConfig.shippedFilesGlobs || DEFAULT_SHIPPED_FILES_GLOBS
  const ignoredFilesGlobs = projectConfig.ignoredFilesGlobs || DEFAULT_IGNORED_FILES_GLOBS

  const files = await fg(shippedFilesGlobs, {dot: true, ignore: ignoredFilesGlobs})

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
  await outputZipToFile(zipFile, tmpZipFile)
  const zipBuffer = fs.readFileSync(tmpZipFile)
  const {size} = fs.statSync(tmpZipFile)

  const uploadTicket = await getNewUploadTicket(projectConfig.project.id)

  await axios.put(uploadTicket.url, zipBuffer, {
    headers: {
      'Content-length': size,
      'Content-Type': 'application/zip',
    },
  })

  // Tag the upload with some info
  const gitInfo = await getCWDGitInfo()
  const zipFileMd5 = await getFileHash(tmpZipFile)
  const uploadDetails: UploadDetails = {
    ...gitInfo,
    zipFileMd5,
  }

  const jobs = await startJobsFromUpload(uploadTicket.id, uploadDetails)
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
