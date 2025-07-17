import axios from 'axios'

import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL} from '@cli/constants/index.js'
import {CredentialsType, Platform} from '@cli/types'

import {ProjectCertificate_Android, ProjectCertificate_iOS, UserCertificate_iOS, UserKey_iOS} from './types.js'

interface UploadTicket {
  url: string
  uuid: string
}

// Returns a signed URL to upload the contents of a credential to
async function getNewUploadTicket(projectId: null | string = null): Promise<UploadTicket> {
  const url = projectId ? `${API_URL}/projects/${projectId}/credentials/url` : `${API_URL}/credentials/url`
  const headers = getAuthedHeaders()
  const {data: uploadInfo} = await axios({
    headers,
    method: 'post',
    url,
  })
  return uploadInfo as UploadTicket
}

export interface UploadCredentialProps {
  contents: ProjectCertificate_Android | ProjectCertificate_iOS | UserCertificate_iOS | UserKey_iOS
  identifier?: string
  platform: Platform
  serialNumber: string
  type: CredentialsType
}

export async function uploadUserCredentials({contents, platform, serialNumber, type}: UploadCredentialProps) {
  // Get somewhere to upload to
  const uploadInfo = await getNewUploadTicket()
  // Upload
  const jsonBuffer = Buffer.from(JSON.stringify(contents))
  await axios.put(uploadInfo.url, jsonBuffer, {
    headers: {
      'Content-Type': 'application/json',
      'Content-length': jsonBuffer.length,
    },
  })
  // Save to our account
  const headers = getAuthedHeaders()
  return await axios({
    data: {
      platform,
      serialNumber,
      type,
      uuid: uploadInfo.uuid,
    },
    headers,
    method: 'post',
    url: `${API_URL}/credentials`,
  })
}

export async function uploadProjectCredentials(
  projectId: string,
  {contents, identifier, platform, serialNumber, type}: UploadCredentialProps,
) {
  // Get somewhere to upload to
  const uploadInfo = await getNewUploadTicket(projectId)
  // Upload
  const jsonBuffer = Buffer.from(JSON.stringify(contents))
  await axios.put(uploadInfo.url, jsonBuffer, {
    headers: {
      'Content-Type': 'application/json',
      'Content-length': jsonBuffer.length,
    },
  })
  // Persist the upload onto the project
  const headers = getAuthedHeaders()
  return await axios({
    data: {
      identifier,
      platform,
      serialNumber,
      type,
      uuid: uploadInfo.uuid,
    },
    headers,
    method: 'post',
    url: `${API_URL}/projects/${projectId}/credentials`,
  })
}
