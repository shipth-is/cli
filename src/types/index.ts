import {SerializedCookieJar} from 'tough-cookie'

import {Project, SelfWithJWT} from './api.js'

// Structure of the auth (~/.shipthis.auth.json) file
export interface AuthConfig {
  appleCookies?: SerializedCookieJar
  shipThisUser?: SelfWithJWT
}

// Only saving the ID in the config file
export interface ProjectJustId {
  id: string
}

// Structure of the project (./shipthis.json) file
export interface ProjectConfig {
  ignoredFilesGlobs?: string[]
  project?: ProjectJustId
  shippedFilesGlobs?: string[]
}

export type ShipGameFlags = {
  download?: string
  downloadAPK?: string
  follow?: boolean
  platform?: 'android' | 'ios'
  skipPublish?: boolean
  verbose?: boolean
  useDemoCredentials?: boolean
  gameEngineVersion?: string
}

export * from './api.js'
export * from './request.js'
