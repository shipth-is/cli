import axios from 'axios'
import * as fs from 'fs'

import {getAuthedHeaders} from '@cli/api/index.js'

import {API_URL} from '@cli/constants/index.js'

export interface ExportCredentialProps {
  zipPath: string
  credentialId: string
  // Only included if the credential is associated with a project
  projectId?: string
}

export async function exportCredential({zipPath, credentialId, projectId}: ExportCredentialProps) {
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

async function downloadFile(url: string, destination: string): Promise<void> {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
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
