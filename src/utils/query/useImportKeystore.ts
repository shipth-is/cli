import fs from 'node:fs'

import {useMutation} from '@tanstack/react-query'
import {v4 as uuid} from 'uuid'
import {ZipFile} from 'yazl'

import {importCredential} from '@cli/api/index.js'
import {cacheKeys} from '@cli/constants/index.js'
import {CredentialsType, Platform, ProjectCredential} from '@cli/types/api.js'
import {queryClient} from '@cli/utils/index.js'


export interface ImportKeystoreProps {
  jksFilePath?: string
  keyPassword?: string
  keystorePassword?: string
  zipFilePath?: string
}

// We take a zipFilePath or a jksFilePath and a keystorePassword and a keyPassword
interface ImportOptions extends ImportKeystoreProps {
  gameId: string
  log?: (message: string) => void
}

export async function importKeystore({log = () => {}, ...opt}: ImportOptions): Promise<ProjectCredential> {
  // Validate the import options
  if (!opt.zipFilePath && !opt.jksFilePath) {
    throw new Error('You must provide either a zipFilePath or a jksFilePath')
  }

  if (opt.zipFilePath && opt.jksFilePath) {
    throw new Error('You cannot provide both a zipFilePath and a jksFilePath')
  }

  if (opt.jksFilePath && (!opt.keystorePassword || !opt.keyPassword)) {
    throw new Error('You must provide both keystorePassword and keyPassword when importing a jks file')
  }

  const toDelete: string[] = []

  // If we are doing a JKS import then we need to create the zip file
  if (opt.jksFilePath) {
    log('Creating zip file from jks file...')
    const outputZipToFile = (zip: ZipFile, fileName: string) =>
      new Promise<void>((resolve) => {
        const outputStream = fs.createWriteStream(fileName)
        zip.outputStream.pipe(outputStream).on('close', () => resolve())
        zip.end()
      })

    // Create a zip file with the jks file
    const zipFile = new ZipFile()
    log('Adding keyStore.jks to zip file...')
    zipFile.addFile(opt.jksFilePath, 'keyStore.jks')

    // Add password.txt (keyStorePassword) and keyPassword.txt (keyPassword)
    log('Adding password.txt and keyPassword.txt to zip file...')
    zipFile.addBuffer(Buffer.from(`${opt.keystorePassword}`), 'password.txt')
    zipFile.addBuffer(Buffer.from(`${opt.keyPassword}`), 'keyPassword.txt')

    const tmpZipFile = `${process.cwd()}/shipthis-keyStore-${uuid()}.zip`
    log(`Writing zip file: ${tmpZipFile}`)
    await outputZipToFile(zipFile, tmpZipFile)
    toDelete.push(tmpZipFile)
    opt.zipFilePath = tmpZipFile
  }

  log('Uploading and importing zip file...')
  const keyStore = await importCredential({
    platform: Platform.ANDROID,
    projectId: opt.gameId,
    type: CredentialsType.CERTIFICATE,
    zipPath: `${opt.zipFilePath}`,
  })
  log('Imported successfully')

  // Delete the temporary zip files
  for (const file of toDelete) {
    log(`Deleting temporary file: ${file}`)
    fs.unlinkSync(file)
  }

  return keyStore as ProjectCredential
}

export const useImportKeystore = () => useMutation({
    mutationFn: importKeystore,
    async onSuccess(data: ProjectCredential) {
      const {projectId} = data
      queryClient.invalidateQueries({
        queryKey: cacheKeys.projectCredentials({pageNumber: 0, projectId}),
      })
    },
  })
