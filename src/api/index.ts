import * as fs from 'node:fs'

import axios from 'axios'
import CryptoJS from 'crypto-js'
import {v4 as uuid} from 'uuid'

import {API_URL, WEB_URL} from '@cli/constants/index.js'
import {
  AgreementVersion,
  APIKey,
  APIKeyCreateRequest,
  APIKeyWithSecret,
  Build,
  EditableProject,
  GoogleAuthResponse,
  GoogleStatusResponse,
  Job,
  PageAndSortParams,
  Platform,
  Project,
  ProjectDetails,
  ProjectPlatformProgress,
  Self,
  TermsResponse,
  UploadDetails,
  UploadTicket,
} from '@cli/types'
import {castArrayObjectDates, castJobDates, castObjectDates} from '@cli/utils/dates.js'

export * from './credentials/index.js'

let currentAuthToken: string | undefined

export function setAuthToken(token: string) {
  currentAuthToken = token
}

export function getAuthToken() {
  return currentAuthToken
}

export function getAuthedHeaders() {
  return {
    Authorization: `Bearer ${currentAuthToken}`,
  }
}

export interface CreateProjectProps {
  details: ProjectDetails
  name: string
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
type StartJobsOptions = {
  platform?: Platform
  skipPublish?: boolean
  verbose?: boolean
  useDemoCredentials?: boolean
  gameEngineVersion?: string
} & UploadDetails

export async function startJobsFromUpload(uploadTicketId: string, startOptions: StartJobsOptions): Promise<Job[]> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.post(`${API_URL}/upload/start/${uploadTicketId}`, startOptions, opt)
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

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 5000

// Returns the builds for a job, retrying if none are found
// The retry is because of possible race condition when a job completes
export async function getJobBuildsRetry(jobId: string, projectId: string, retries = MAX_RETRIES): Promise<Build[]> {
  let job: Job | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    job = await getJob(jobId, projectId)
    if (job.builds && job.builds.length > 0) break
    if (attempt < MAX_RETRIES) await new Promise((res) => setTimeout(res, RETRY_DELAY_MS))
  }

  if (!job?.builds || job.builds.length === 0) throw new Error('No builds found for this job after multiple attempts')

  return job.builds
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
  return url
}

// Builds a URL that emails the user the login-OTP when visited and shows the form.
// Auth is checked and they are redirected.
// TODO: this logic and the salt should be moved to the backend
export async function getShortAuthRequiredUrl(destination: string) {
  // We encrypt their email address in the URL to obfuscate it
  // The frontend will decrypt the email and use it to send the OTP
  const {email} = await getSelf()
  // We include a random key
  const key = uuid()
  // With a little salt
  const salt = 'Na (s) + 1/2 Cl₂ (g) → NaCl (s)'
  const fullKey = `${key}${salt}`
  const token = CryptoJS.AES.encrypt(email, fullKey).toString()
  const params = {
    destination,
    key,
    token,
  }
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(`${value}`)}`)
    .join('&')
  const url = `${WEB_URL}login/?${queryString}`
  const headers = await getAuthedHeaders()
  // Shorten the url so that the QR code is smaller.
  // Also the final link will expire in 24 hours
  const {data} = await axios.post(
    `${API_URL}/me/shorten`,
    {
      url,
    },
    {headers},
  )
  return data.url
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

// Tells us the current agreement / terms status for the user
export async function getTerms(): Promise<TermsResponse> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.get(`${API_URL}/me/terms`, opt)
  return {
    // Any agreements which have changed since the user last accepted terms
    changes: castArrayObjectDates<AgreementVersion>(data.changes),
    // Current versions of any agreements
    current: castArrayObjectDates<AgreementVersion>(data.current),
  } as TermsResponse
}

// Marks the current user as accepting the current version of terms and privacy
export async function acceptTerms(): Promise<Self> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.post(`${API_URL}/me/terms`, {}, opt)
  return castObjectDates<Self>(data)
}

// Makes a url for the OAuth-flow which starts at the Google hosted auth page
export async function getGoogleAuthUrl(projectId: string): Promise<string> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  // We redirect to a fixed place (not passing id here - cant add a value)
  const web = encodeURIComponent(new URL('/google/redirect/', WEB_URL).href)
  const url = `${API_URL}/projects/${projectId}/credentials/android/key/connect`
  const {data} = await axios.get(`${url}?redirectUri=${web}`, opt)
  const response = data as GoogleAuthResponse
  // We want them to be logged in
  return await getShortAuthRequiredUrl(response.url)
}

// Deletes the current user's Google connection token
export async function disconnectGoogle(): Promise<void> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  await axios.delete(`${API_URL}/me/google/connect`, opt)
}

export async function getGoogleStatus(): Promise<GoogleStatusResponse> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.get(`${API_URL}/me/google/status`, opt)
  return castObjectDates<GoogleStatusResponse>(data, ['orgCreatedAt'])
}

// enforce constraints/iam.disableServiceAccountKeyCreation for orgs`
export async function enforcePolicy(): Promise<GoogleStatusResponse> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.post(`${API_URL}/me/google/policy`, null, opt)
  return castObjectDates<GoogleStatusResponse>(data, ['orgCreatedAt'])
}

// revoke constraints/iam.disableServiceAccountKeyCreation for orgs
export async function revokePolicy(): Promise<GoogleStatusResponse> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.delete(`${API_URL}/me/google/policy`, opt)
  return castObjectDates<GoogleStatusResponse>(data, ['orgCreatedAt'])
}

export async function inviteServiceAccount(projectId: string, developerId: string) {
  try {
    const headers = getAuthedHeaders()
    const {data} = await axios.post(
      `${API_URL}/projects/${projectId}/credentials/android/key/invite/`,
      {developerId},
      {
        headers,
      },
    )
    return data
  } catch (error) {
    console.error('inviteServiceAccount Error', error)
    throw error
  }
}

// Downloads a build artifact from the given projectId and buildId
export async function downloadBuildById(projectId: string, buildId: string, fileName: string): Promise<void> {
  const build = await getBuild(projectId, buildId)
  const {url} = build
  const writer = fs.createWriteStream(fileName)
  const response = await axios({
    method: 'GET',
    responseType: 'stream',
    url,
  })
  response.data.pipe(writer)
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

const APIKEYS_DATE_FIELDS = ['createdAt', 'updatedAt', 'expiresAt', 'lastUsedAt', 'revokedAt']

// get page of ShipThis APIkeys for use in CI
export async function getAPIKeys(params: PageAndSortParams): Promise<ListResponse<APIKey>> {
  const headers = getAuthedHeaders()
  const opt = {headers, params}
  const {data: rawData} = await axios.get(`${API_URL}/me/keys`, opt)
  const data = castArrayObjectDates<APIKey>(rawData.data, APIKEYS_DATE_FIELDS)
  return {
    data,
    pageCount: rawData.pageCount,
  }
}

// Create a new API key
export async function createAPIKey(createProps: APIKeyCreateRequest): Promise<APIKeyWithSecret> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  const {data} = await axios.post(`${API_URL}/me/keys`, createProps, opt)
  // The only time we get the secret is when we create a new API key
  return castObjectDates<APIKeyWithSecret>(data, APIKEYS_DATE_FIELDS)
}

// Revoke (HTTP DELETE) an API key by ID
export async function revokeAPIKey(apiKeyId: string): Promise<void> {
  const headers = getAuthedHeaders()
  const opt = {headers}
  await axios.delete(`${API_URL}/me/keys/${apiKeyId}`, opt)
}
