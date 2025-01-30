import axios from 'axios'

import {API_URL, WEB_URL} from '@cli/constants/index.js'
import {
  Build,
  EditableProject,
  GoogleAuthResponse,
  Job,
  PageAndSortParams,
  Platform,
  Project,
  ProjectDetails,
  ProjectPlatformProgress,
  Self,
  UploadDetails,
  UploadTicket,
} from '@cli/types'
import {castArrayObjectDates, castJobDates, castObjectDates} from '@cli/utils/dates.js'

export * from './credentials/index.js'

const AUTH_ENV_VAR_NAME = 'SHIPTHIS_TOKEN'

// Most API functions will use getAuthedHeaders or process.env.SHIPTHIS_TOKEN
// When the commands run, the value for token will be read from the auth config
export function setAuthToken(token: string) {
  process.env[AUTH_ENV_VAR_NAME] = token
}

export function getAuthToken() {
  return process.env[AUTH_ENV_VAR_NAME]
}

export function getAuthedHeaders() {
  return {
    Authorization: `Bearer ${process.env[AUTH_ENV_VAR_NAME]}`,
  }
}

export interface CreateProjectProps {
  name: string
  details: ProjectDetails
}

export async function createProject(props: CreateProjectProps): Promise<Project> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.post(`${API_URL}/projects`, props, opt)
  return castObjectDates<Project>(data)
}

export async function getProject(projectId: string): Promise<Project> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.get(`${API_URL}/projects/${projectId}`, opt)
  return castObjectDates<Project>(data)
}

export interface ListResponse<T> {
  data: T[]
  pageCount: number
}

export async function getProjects(params: PageAndSortParams): Promise<ListResponse<Project>> {
  const headers = getAuthedHeaders()
  const opt = {headers, params}
  const {data: rawData} = await axios.get(`${API_URL}/projects`, opt)
  const data = castArrayObjectDates<Project>(rawData.data)
  return {
    data,
    pageCount: rawData.pageCount,
  }
}

export async function updateProject(projectId: string, edits: EditableProject): Promise<Project> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.put(`${API_URL}/projects/${projectId}`, edits, opt)
  return castObjectDates<Project>(data)
}

export async function getProjectPlatformProgress(
  projectId: string,
  platform: Platform,
): Promise<ProjectPlatformProgress> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.get(`${API_URL}/projects/${projectId}/${platform}/progress`, opt)
  return data as ProjectPlatformProgress
}

// An UploadTicket is a request to upload. We do a HTTP PUT to the url returned
export async function getNewUploadTicket(projectId: string): Promise<UploadTicket> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.post(`${API_URL}/upload/${projectId}/url`, {}, opt)
  return data as UploadTicket
}

// Tells the backend to start running the jobs for an upload-ticket
export async function startJobsFromUpload(uploadTicketId: string, uploadDetails: UploadDetails): Promise<Job[]> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.post(`${API_URL}/upload/start/${uploadTicketId}`, uploadDetails, opt)
  return castArrayObjectDates<Job>(data)
}

// Get a page of jobs for a project
export async function getProjectJobs(projectId: string, params: PageAndSortParams): Promise<ListResponse<Job>> {
  const headers = getAuthedHeaders()
  const opt = {headers, params}
  const {data: rawData} = await axios.get(`${API_URL}/projects/${projectId}/jobs`, opt)
  const data = castArrayObjectDates<Job>(rawData.data)
  return {
    data,
    pageCount: rawData.pageCount,
  }
}

// Returns a single job
export async function getJob(jobId: string, projectId: string): Promise<Job> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.get(`${API_URL}/projects/${projectId}/jobs/${jobId}`, opt)
  // Special handling for dates on the jobs because of the "build"
  return castJobDates(data)
}

// Returns a url with an OTP - when visited it authenticates the user
export async function getSingleUseUrl(destination: string) {
  // Call the API to generate an OTP
  const headers = await getAuthedHeaders()
  const {data} = await axios.post(`${API_URL}/me/otp`, {}, {headers})
  // Convert data (otp and userId) and the destination into a query string
  const queryString = Object.entries({...data, destination})
    .map(([key, value]) => `${key}=${encodeURIComponent(`${value}`)}`)
    .join('&')
  // Build the url
  const url = `${WEB_URL}exchange/?${queryString}`
  // Shorten the url so that the QR code is smaller
  const {data: shortenData} = await axios.post(
    `${API_URL}/me/shorten`,
    {
      url,
    },
    {headers},
  )
  const fullUrl = new URL(shortenData.path, API_URL).href
  // Caller can use the open() function to launch the browser
  return fullUrl
}

// Returns a single build - used in the game:build:download command
export async function getBuild(projectId: string, buildId: string): Promise<Build> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.get(`${API_URL}/projects/${projectId}/builds/${buildId}`, opt)
  return castObjectDates<Build>(data)
}

// Returns the current user
export async function getSelf(): Promise<Self> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.get(`${API_URL}/me`, opt)
  return castObjectDates<Self>(data)
}

// Marks the current user as accepting the T&cs and privacy
export async function acceptTerms(): Promise<Self> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.post(`${API_URL}/me/acceptTerms`, {}, opt)
  return castObjectDates<Self>(data)
}

export async function getGoogleAuthUrl(projectId: string): Promise<string> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const web = encodeURIComponent(new URL('/google/redirect/', WEB_URL).href)
  const url = `${API_URL}/projects/${projectId}/credentials/android/key/connect`
  const {data} = await axios.get(`${url}?redirectUri=${web}`, opt)
  const response = data as GoogleAuthResponse
  // We want them to be logged in
  return await getSingleUseUrl(response.url)
}
