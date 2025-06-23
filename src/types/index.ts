import {SerializedCookieJar} from 'tough-cookie'

import {Project, SelfWithJWT} from './api.js'

// Structure of the auth (~/.shipthis.auth.json) file
export interface AuthConfig {
  shipThisUser?: SelfWithJWT
  appleCookies?: SerializedCookieJar
}

// Structure of the project (./shipthis.json) file
export interface ProjectConfig {
  project?: Project
  shippedFilesGlobs?: string[]
  ignoredFilesGlobs?: string[]
}

export type ShipGameFlags = {
  platform?: 'android' | 'ios'
  skipPublish?: boolean
  download?: string
  downloadAPK?: string
  follow?: boolean
}

export * from './api.js'
export * from './request.js'
