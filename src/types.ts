import {CookieJar} from 'tough-cookie'
import {DateTime} from 'luxon'

export interface Self {
  id: string
  email: string
  createdAt: DateTime
  updatedAt: DateTime
  jwt: string
}

export interface AuthConfig {
  shipThisUser?: Self
  appleCookies?: CookieJar.Serialized
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
