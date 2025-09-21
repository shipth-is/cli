import axios from 'axios'

import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL} from '@cli/constants/index.js'
import {ProjectCredential, UserCredential} from '@cli/types'
import {castArrayObjectDates} from '@cli/utils/dates.js'

export * from './export.js'
export * from './import.js'
export * from './types.js'
export * from './upload.js'

export async function getUserCredentials(pageSize = 100): Promise<UserCredential[]> {
  const headers = getAuthedHeaders()
  const {data} = await axios({
    headers,
    method: 'get',
    url: `${API_URL}/credentials?pageSize=${pageSize}`,
  })
  return castArrayObjectDates<UserCredential>(data.data)
}

export interface DeleteCredentialOptions {
  credentialId: string
  isImmediate?: boolean // If true, delete immediately rather than waiting for automatic cleanup
}

export async function deleteUserCredential(options: DeleteCredentialOptions): Promise<void> {
  const headers = getAuthedHeaders()
  const {data} = await axios({
    headers,
    method: 'delete',
    url: `${API_URL}/credentials/${options.credentialId}`,
    params: {
      isImmediate: options.isImmediate,
    },
  })
  return data
}

export async function getProjectCredentials(projectId: string, pageSize = 100): Promise<ProjectCredential[]> {
  const headers = getAuthedHeaders()
  const {data} = await axios({
    headers,
    method: 'get',
    url: `${API_URL}/projects/${projectId}/credentials?pageSize=${pageSize}`,
  })
  return castArrayObjectDates<ProjectCredential>(data.data)
}

export async function deleteProjectCredential(projectId: string, options: DeleteCredentialOptions): Promise<void> {
  const headers = getAuthedHeaders()
  const {data} = await axios({
    headers,
    method: 'delete',
    url: `${API_URL}/projects/${projectId}/credentials/${options.credentialId}`,
    params: {
      isImmediate: options.isImmediate,
    },
  })
  return data
}
