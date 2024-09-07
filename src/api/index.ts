import axios from 'axios'

import {API_URL} from '@cli/config.js'
import {EditableProject, Project} from '@cli/types.js'

const AUTH_ENV_VAR_NAME = 'SHIPTHIS_AUTH_TOKEN'

// Most API functions will use getAuthedHeaders or process.env.AUTH_TOKEN
// When the commands run, the value for token will be read from the auth config
export function setAuthToken(token: string) {
  process.env[AUTH_ENV_VAR_NAME] = token
}

export function getAuthedHeaders() {
  return {
    Authorization: `Bearer ${process.env[AUTH_ENV_VAR_NAME]}`,
  }
}

export async function createProject(name: string): Promise<Project> {
  const headers = await getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.post(`${API_URL}/projects`, {name}, opt)
  return data as Project
}

export async function getProject(projectId: string): Promise<Project> {
  const headers = await getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.get(`${API_URL}/projects/${projectId}`, opt)
  return data as Project
}

export async function updateProject(projectId: string, edits: EditableProject): Promise<Project> {
  const headers = await getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.put(`${API_URL}/projects/${projectId}`, edits, opt)
  return data as Project
}
