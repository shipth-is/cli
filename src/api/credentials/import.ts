import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL} from '@cli/constants/index.js'
import {CredentialsType, Platform, ProjectCredential, UserCredential} from '@cli/types'
import axios from 'axios'
import {promises as fsAsync} from 'node:fs'

interface ImportTicket {
  url: string
  uuid: string
}

// Returns a signed URL to upload a ZIP for importation
async function getNewImportTicket(projectId: string | undefined): Promise<ImportTicket> {
  const url = projectId
    ? `${API_URL}/projects/${projectId}/credentials/import/url`
    : `${API_URL}/credentials/import/url`
  const headers = getAuthedHeaders()
  const {data: importInfo} = await axios({
    headers,
    method: 'post',
    url,
  })
  return importInfo as ImportTicket
}

export interface ImportCredentialProps {
  platform: Platform
  projectId?: string // Omit if importing a user certificate
  type: CredentialsType
  zipPath: string
}

export async function importCredential({
  platform,
  projectId,
  type,
  zipPath,
}: ImportCredentialProps): Promise<ProjectCredential | UserCredential> {
  // Request a new import
  const importTicket = await getNewImportTicket(projectId)
  // Upload zip to the given url
  const zipBuffer = await fsAsync.readFile(zipPath)
  await axios.put(importTicket.url, zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-length': zipBuffer.length,
    },
  })

  const headers = getAuthedHeaders()

  const url = projectId ? `${API_URL}/projects/${projectId}/credentials/import` : `${API_URL}/credentials/import`

  // Trigger import for this import request
  const {data: publicCredential} = await axios({
    data: {
      platform,
      type,
      uuid: importTicket.uuid,
    },
    headers,
    method: 'post',
    url,
  })

  if (projectId) {
    // If we have a projectId, we need to return the project credential
    return publicCredential as ProjectCredential
  }

  return publicCredential as UserCredential
}
