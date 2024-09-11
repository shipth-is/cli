import axios from 'axios'

import {API_URL} from '@cli/config.js'
import {
  EditableProject,
  PageAndSortParams,
  Platform,
  Project,
  ProjectPlatformProgress,
  UploadTicket,
} from '@cli/types.js'
import {castArrayObjectDates, castObjectDates} from '@cli/utils/dates.js'

const AUTH_ENV_VAR_NAME = 'SHIPTHIS_TOKEN'

// Most API functions will use getAuthedHeaders or process.env.SHIPTHIS_TOKEN
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
  return castObjectDates<Project>(data)
}

export async function getProject(projectId: string): Promise<Project> {
  const headers = await getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.get(`${API_URL}/projects/${projectId}`, opt)
  return castObjectDates<Project>(data)
}

export interface ListResponse<T> {
  data: T[]
  pageCount: number
}

export async function getProjects(params: PageAndSortParams): Promise<ListResponse<Project>> {
  const headers = await getAuthedHeaders()
  const opt = {headers, params}
  const {data: rawData} = await axios.get(`${API_URL}/projects`, opt)
  const data = castArrayObjectDates<Project>(rawData.data)
  return {
    data,
    pageCount: rawData.pageCount,
  }
}

export async function updateProject(projectId: string, edits: EditableProject): Promise<Project> {
  const headers = await getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.put(`${API_URL}/projects/${projectId}`, edits, opt)
  return castObjectDates<Project>(data)
}

export async function getProjectPlatformProgress(
  projectId: string,
  platform: Platform,
): Promise<ProjectPlatformProgress> {
  const headers = await getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.get(`${API_URL}/projects/${projectId}/${platform}/progress`, opt)
  return data as ProjectPlatformProgress
}

// An UploadTicket is a request to upload. We do a HTTP PUT to the url returned
export async function getNewUploadTicket(projectId: string): Promise<UploadTicket> {
  const headers = await getAuthedHeaders()
  const opt = {headers}
  console.log('getting upload ticket', `${API_URL}/uploads/${projectId}/url`)
  const {data} = await axios.post(`${API_URL}/uploads/${projectId}/url`, {}, opt)
  return data as UploadTicket
}

// Tells the backend to start running the jobs for an upload-ticket
export async function startJobsFromUpload(uploadTicketId: string): Promise<void> {
  const headers = await getAuthedHeaders()
  const opt = {headers}
  await axios.post(`${API_URL}/uploads/start/${uploadTicketId}`, {}, opt)
}
