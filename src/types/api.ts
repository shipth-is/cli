import {DateTime} from 'luxon'

export type Scalar = boolean | null | number | string | undefined

export type ScalarDict = {
  [key: string]: Scalar
}

export interface UserDetails {
  hasAcceptedTerms?: boolean
  source?: string
  termsAgreementVersionId?: AgreementVersion['id'];
  privacyAgreementVersionId?: AgreementVersion['id'];
}

export interface Self {
  createdAt: DateTime
  details: UserDetails
  email: string
  id: string
  updatedAt: DateTime
}

export type SelfWithJWT = {
  jwt: string
} & Self

export enum Platform {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
}

export enum GameEngine {
  GODOT = 'godot',
}

export interface ProjectDetails {
  androidPackageName?: string
  buildNumber?: number
  gameEngine?: GameEngine
  gameEngineVersion?: string
  gcpProjectId?: string
  gcpServiceAccountId?: string
  iosBundleId?: string
  semanticVersion?: string
  useDemoCredentials?: boolean
}

// What the POST/PUT endpoints accept for creating/updating a project
export interface EditableProject {
  details?: ProjectDetails
  name: string
}

// What a project from the API looks like
export interface Project extends EditableProject {
  createdAt: DateTime
  id: string
  updatedAt: DateTime
}

export interface ProjectPlatformProgress {
  hasApiKeyForPlatform: boolean
  hasBundleSet: boolean
  hasCredentialsForPlatform: boolean
  hasSuccessfulJobForPlatform: boolean
  platform: string
}

export interface UploadTicket {
  id: string
  url: string
}

export interface Upload {
  bucketName: string
  createdAt: DateTime
  details: UploadDetails
  id: string
  key: string
  updatedAt: DateTime
  url: string
  userId: string
}

export type UploadDetails = {
  gitBranch?: string
  gitCommitHash?: string
  zipFileMd5?: string
}

export enum JobStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
}

export type JobDetails = {
  skipPublish?: boolean // If true, don't publish the build to the store
} & ProjectDetails &
  UploadDetails

export interface Job {
  builds?: Build[]
  createdAt: DateTime
  details: JobDetails
  id: string
  project: Project
  status: JobStatus
  type: Platform // not the best named field
  updatedAt: DateTime
  upload: Upload
}

export enum JobStage {
  BUILD = 'BUILD',
  CONFIGURE = 'CONFIGURE',
  EXPORT = 'EXPORT',
  PUBLISH = 'PUBLISH',
  SETUP = 'SETUP',
}

export enum LogLevel {
  ERROR = 'ERROR',
  INFO = 'INFO',
  WARN = 'WARN',
}

export interface JobLogEntry {
  createdAt: DateTime
  details: object
  id: string
  jobId: Job['id']
  level: LogLevel
  message: string
  progress?: number // When we receive via the WebSocket
  sentAt: DateTime
  stage: JobStage
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
  bucketName: string
  createdAt: DateTime
  id: string
  isActive: boolean
  key: string
  platform: Platform
  serialNumber: string
  type: CredentialsType
  updatedAt: DateTime
  url: string
  userId: string
}

export interface ProjectCredential extends UserCredential {
  identifier: string
  projectId: string
}

export enum BuildType {
  AAB = 'AAB',
  APK = 'APK',
  IPA = 'IPA',
}

export interface Build {
  buildType: BuildType
  createdAt: DateTime
  details: ScalarDict
  id: string
  // we don't want to make a circular reference to the job
  jobDetails: JobDetails
  jobId: Job['id']
  platform: Platform
  projectId: Project['id']
  // When we display the list of builds we want to show some details and
  updatedAt: DateTime
  url: string
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
  appExists: boolean
  errorMessage?: string
  hasEnabledApi: boolean
  hasInvitedServiceAccount: boolean
  hasKey: boolean
  hasProject: boolean
  hasServiceAccount: boolean
  hasSignedIn: boolean
  hasUploadedKey: boolean
  progress: number
  serviceAccountEmail: null | string
  status: 'complete' | 'error' | 'queued' | 'running' | 'unknown'
}

// Reply when you connect to Google - this is the status of the user
export interface GoogleStatusResponse {
  isAuthenticated: boolean
  isOrg?: boolean
  needsPolicyChange?: boolean
  orgCreatedAt?: DateTime
  orgName?: string
  orgResourceName?: string // e.g. "organizations/1234"
  projectId?: string
}

export interface APIKey {
  createdAt: DateTime
  expiresAt: DateTime
  id: string
  lastUsedAt?: DateTime
  name: string
  revokedAt?: DateTime
  updatedAt: DateTime
}
export interface APIKeyWithSecret extends APIKey {
  secret: string
}
export interface APIKeyCreateRequest {
  durationDays: number
  name: string
}

export interface AgreementVersion {
  id: string
  agreementType: string
  versionName: string
  description: string
  isInitial: boolean
  createdAt: DateTime
  updatedAt: DateTime
  path: string
}

export interface TermsResponse {
  changes: AgreementVersion[]
  current: AgreementVersion[]
}
