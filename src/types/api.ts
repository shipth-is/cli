import {DateTime} from 'luxon'

export type Scalar = string | number | boolean | null | undefined

export type ScalarDict = {
  [key: string]: Scalar
}

export interface UserDetails {
  hasAcceptedTerms?: boolean
}

export interface Self {
  id: string
  email: string
  details: UserDetails
  createdAt: DateTime
  updatedAt: DateTime
}

export type SelfWithJWT = Self & {
  jwt: string
}

export enum Platform {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
}

export enum GameEngine {
  GODOT = 'godot',
}

export interface ProjectDetails {
  gameEngine?: GameEngine
  gameEngineVersion?: string
  iosBundleId?: string
  androidPackageName?: string
  buildNumber?: number
  semanticVersion?: string
}

// What the POST/PUT endpoints accept for creating/updating a project
export interface EditableProject {
  name: string
  details?: ProjectDetails
}

// What a project from the API looks like
export interface Project extends EditableProject {
  id: string
  createdAt: DateTime
  updatedAt: DateTime
}

export interface ProjectPlatformProgress {
  platform: string
  hasBundleSet: boolean
  hasCredentialsForPlatform: boolean
  hasApiKeyForPlatform: boolean
  hasSuccessfulJobForPlatform: boolean
}

export interface UploadTicket {
  url: string
  id: string
}

export interface Upload {
  id: string
  userId: string
  bucketName: string
  key: string
  createdAt: DateTime
  updatedAt: DateTime
  url: string
  details: UploadDetails
}

export type UploadDetails = {
  gitCommitHash?: string
  gitBranch?: string
  zipFileMd5?: string
}

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export type JobDetails = ProjectDetails & UploadDetails

export interface Job {
  id: string
  project: Project
  upload: Upload
  type: Platform // not the best named field
  status: JobStatus
  createdAt: DateTime
  updatedAt: DateTime
  details: JobDetails
  build?: Build
}

export enum JobStage {
  SETUP = 'SETUP',
  EXPORT = 'EXPORT',
  CONFIGURE = 'CONFIGURE',
  BUILD = 'BUILD',
  PUBLISH = 'PUBLISH',
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface JobLogEntry {
  id: string
  level: LogLevel
  stage: JobStage
  jobId: Job['id']
  message: string
  details: object
  sentAt: DateTime
  createdAt: DateTime
  progress?: number // When we receive via the WebSocket
}

export interface CursorPaginatedResponse<T> {
  data: T[]
  nextCursor: string
}

export interface OffsetPaginatedResponse<T> {
  data: T[]
  pageCount: number
}

export enum CredentialsType {
  CERTIFICATE = 'CERTIFICATE',
  KEY = 'KEY',
}
export interface UserCredential {
  id: string
  platform: Platform
  type: CredentialsType
  bucketName: string
  key: string
  createdAt: DateTime
  updatedAt: DateTime
  url: string
  serialNumber: string
  isActive: boolean
  userId: string
}

export interface ProjectCredential extends UserCredential {
  projectId: string
  identifier: string
}

export interface Build {
  id: string
  jobId: Job['id']
  projectId: Project['id']
  platform: Platform
  details: ScalarDict
  createdAt: DateTime
  updatedAt: DateTime
  url: string
  // When we display the list of builds we want to show some details and
  // we don't want to make a circular reference to the job
  jobDetails: JobDetails
}

// URL params received by the Google Redirect destination
export interface GoogleOAuthRedirectResponse {
  code?: string
  error?: string
}

// What we receive from /me/google/connect - tells us which page to redirect to
export interface GoogleOAuthPersistTokenResponse {
  projectId: string
}

// Response from /auth/google
export interface GoogleAuthResponse {
  url: string
}

export interface AndroidServiceAccountSetupStatus {
  status: 'unknown' | 'queued' | 'running' | 'complete' | 'error'
  errorMessage?: string
  hasSignedIn: boolean
  hasProject: boolean
  hasServiceAccount: boolean
  hasKey: boolean
  hasUploadedKey: boolean
  hasEnabledApi: boolean
  appExists: boolean
  serviceAccountEmail: string | null
  hasInvitedServiceAccount: boolean
  progress: number
}

export interface GoogleStatusResponse {
  isAuthenticated: boolean
  projectId?: string
  isOrg?: boolean
  orgName?: string
  orgCreatedAt?: string
}
