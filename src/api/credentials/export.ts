import * as fs from 'node:fs'

import axios from 'axios'

import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL} from '@cli/constants/index.js'

export interface ExportCredentialProps {
  credentialId: string
  // Only included if the credential is associated with a project
  projectId?: string
  zipPath: string
}

export async function exportCredential({credentialId, projectId, zipPath}: ExportCredentialProps) {
  const headers = getAuthedHeaders()

  const url = projectId
    ? `${API_URL}/projects/${projectId}/credentials/${credentialId}/export`
    : `${API_URL}/credentials/${credentialId}/export`

  const {data} = await axios.post(
    url,
    {}, // no-body
    {headers},
  )

  const downloadUrl = data.url

  return await downloadFile(downloadUrl, zipPath)
}

// The url is a signed link to {serialNumber, scriptEncryptionKey}. It needs no auth headers.
// A failed axios request holds the url in its config, so it must not leave this function.
export async function downloadEncryptionKey(url: string): Promise<string> {
  let key: unknown
  try {
    const {data} = await axios.get(url)
    key = data?.scriptEncryptionKey
  } catch {
    throw new Error('Could not download the encryption key. Please try again.')
  }

  if (typeof key !== 'string' || !key) throw new Error('The encryption key download had no key in it.')
  return key
}

async function downloadFile(url: string, destination: string): Promise<void> {
  const response = await axios({
    method: 'GET',
    responseType: 'stream',
    url,
  })

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination)
    response.data.pipe(file)

    file.on('finish', () => {
      file.close()
      resolve()
    })

    file.on('error', (err) => {
      fs.unlink(destination, () => reject(err))
    })
  })
}
