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

export async function getProjectCredentials(projectId: string, pageSize = 100): Promise<ProjectCredential[]> {
  const headers = getAuthedHeaders()
  const {data} = await axios({
    headers,
    method: 'get',
    url: `${API_URL}/projects/${projectId}/credentials?pageSize=${pageSize}`,
  })
  return castArrayObjectDates<ProjectCredential>(data.data)
}
