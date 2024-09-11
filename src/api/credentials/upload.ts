import axios from 'axios'

import {Platform} from '@cli/types.js'

import {
  CredentialsType,
  ProjectCertificate_Android,
  ProjectCertificate_iOS,
  UserCertificate_iOS,
  UserKey_iOS,
} from './types.js'

import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL} from '@cli/config.js'

interface UploadTicket {
  url: string
  uuid: string
}

// Returns a signed URL to upload the contents of a credential to
async function getNewUploadTicket(projectId: string | null = null): Promise<UploadTicket> {
  const url = projectId ? `${API_URL}/projects/${projectId}/credentials/url` : `${API_URL}/credentials/url`
  const headers = getAuthedHeaders()
  const {data: uploadInfo} = await axios({
    method: 'post',
    url,
    headers,
  })
  return uploadInfo as UploadTicket
}

export interface UploadCredentialProps {
  contents: UserCertificate_iOS | UserKey_iOS | ProjectCertificate_iOS | ProjectCertificate_Android
  platform: Platform
  type: CredentialsType
  serialNumber: string
  identifier?: string
}

export async function uploadUserCredentials({contents, platform, type, serialNumber}: UploadCredentialProps) {
  // Get somewhere to upload to
  const uploadInfo = await getNewUploadTicket()
  // Upload
  const jsonBuffer = Buffer.from(JSON.stringify(contents))
  await axios.put(uploadInfo.url, jsonBuffer, {
    headers: {
      'Content-length': jsonBuffer.length,
      'Content-Type': 'application/json',
    },
  })
  // Save to our account
  const headers = getAuthedHeaders()
  return await axios({
    method: 'post',
    url: `${API_URL}/credentials`,
    headers,
    data: {
      platform,
      type,
      uuid: uploadInfo.uuid,
      serialNumber,
    },
  })
}

export async function uploadProjectCredentials(
  projectId: string,
  {contents, platform, type, serialNumber, identifier}: UploadCredentialProps,
) {
  // Get somewhere to upload to
  const uploadInfo = await getNewUploadTicket(projectId)
  // Upload
  const jsonBuffer = Buffer.from(JSON.stringify(contents))
  await axios.put(uploadInfo.url, jsonBuffer, {
    headers: {
      'Content-length': jsonBuffer.length,
      'Content-Type': 'application/json',
    },
  })
  // Persist the upload onto the project
  const headers = getAuthedHeaders()
  return await axios({
    method: 'post',
    url: `${API_URL}/projects/${projectId}/credentials`,
    headers,
    data: {
      platform,
      type,
      uuid: uploadInfo.uuid,
      identifier,
      serialNumber,
    },
  })
}
