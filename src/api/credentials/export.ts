import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL} from '@cli/constants/index.js'
import axios from 'axios'
import * as fs from 'node:fs'

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
