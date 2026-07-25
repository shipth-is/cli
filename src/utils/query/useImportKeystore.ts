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

  // Only ever holds zip files we generated ourselves - never a caller supplied zipFilePath
  const toDelete: string[] = []

  try {
    // If we are doing a JKS import then we need to create the zip file
    if (opt.jksFilePath) {
      log('Creating zip file from jks file...')
      const outputZipToFile = (zip: ZipFile, fileName: string) =>
        new Promise<void>((resolve, reject) => {
          const outputStream = fs.createWriteStream(fileName)
          let failure: Error | null = null

          // Settle only once the file handle is released, otherwise the stream can
          // still create the file after cleanup has run
          const fail = (error: Error) => {
            if (failure) return
            failure = error
            outputStream.destroy()
          }

          // yazl reports entry failures (eg. a missing jks) on the ZipFile itself
          zip.on('error', fail)
          zip.outputStream.on('error', fail)
          outputStream.on('error', fail)
          outputStream.on('close', () => (failure ? reject(failure) : resolve()))

          zip.outputStream.pipe(outputStream)
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
      // Track before writing so a partially written zip is cleaned up too
      toDelete.push(tmpZipFile)
      await outputZipToFile(zipFile, tmpZipFile)
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

    return keyStore as ProjectCredential
  } finally {
    // The generated zip holds the keystore and both passwords in plaintext, so it must
    // be removed even when the import fails
    for (const file of toDelete) {
      if (!fs.existsSync(file)) continue
      try {
        log(`Deleting temporary file: ${file}`)
        fs.unlinkSync(file)
      } catch (error) {
        log(`Failed to remove temporary file ${file}: ${String(error)}`)
      }
    }
  }
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
