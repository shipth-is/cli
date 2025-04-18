import axios from 'axios'

import {promises as fsAsync} from 'fs'

import {getAuthedHeaders} from '@cli/api/index.js'

import {API_URL} from '@cli/constants/index.js'
import {CredentialsType, Platform, ProjectCredential, UserCredential} from '@cli/types'

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
    method: 'post',
    url,
    headers,
  })
  return importInfo as ImportTicket
}

export interface ImportCredentialProps {
  projectId?: string // Omit if importing a user certificate
  zipPath: string
  type: CredentialsType
  platform: Platform
}

export async function importCredential({
  projectId,
  zipPath,
  type,
  platform,
}: ImportCredentialProps): Promise<UserCredential | ProjectCredential> {
  // Request a new import
  const importTicket = await getNewImportTicket(projectId)
  // Upload zip to the given url
  const zipBuffer = await fsAsync.readFile(zipPath)
  await axios.put(importTicket.url, zipBuffer, {
    headers: {
      'Content-length': zipBuffer.length,
      'Content-Type': 'application/zip',
    },
  })

  const headers = getAuthedHeaders()

  const url = projectId ? `${API_URL}/projects/${projectId}/credentials/import` : `${API_URL}/credentials/import`

  // Trigger import for this import request
  const {data: publicCredential} = await axios({
    method: 'post',
    url,
    headers,
    data: {
      uuid: importTicket.uuid,
      type,
      platform,
    },
  })

  if (projectId) {
    // If we have a projectId, we need to return the project credential
    return publicCredential as ProjectCredential
  }

  return publicCredential as UserCredential
}
