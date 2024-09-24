import {SerializedCookieJar} from 'tough-cookie'
import {DateTime} from 'luxon'

export type Scalar = string | number | boolean | null | undefined

export type ScalarDict = {
  [key: string]: Scalar
}

export interface Self {
  id: string
  email: string
  createdAt: DateTime
  updatedAt: DateTime
  jwt: string
}

export interface AuthConfig {
  shipThisUser?: Self
  appleCookies?: SerializedCookieJar
}

// What the POST/PUT endpoints accept for creating/updating a project
export interface EditableProject {
  name: string
  details?: {
    iosBundleId?: string
    androidPackageName?: string
  }
}

// What a project from the API looks like
export interface Project extends EditableProject {
  id: string
  createdAt: DateTime
  updatedAt: DateTime
}

// Structure of the JSON project config file
export interface ProjectConfig {
  project?: Project
  shippedFilesGlobs?: string[]
  ignoredFilesGlobs?: string[]
}

export enum Platform {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
}

export interface ProjectPlatformProgress {
  platform: string
  hasBundleSet: boolean
  hasCredentialsForPlatform: boolean
  hasApiKeyForPlatform: boolean
  hasSuccessfulJobForPlatform: boolean
}

export interface PageAndSortParams {
  pageNumber?: number
  pageSize?: number
  order?: 'asc' | 'desc'
  orderBy?: 'createdAt' | 'updatedAt'
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
}

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Job {
  id: string
  project: Project
  upload: Upload
  type: Platform // not the best named field
  status: JobStatus
  createdAt: DateTime
  updatedAt: DateTime
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
  jobId: string
  message: string
  details: object
  sentAt: DateTime
  createdAt: DateTime
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
