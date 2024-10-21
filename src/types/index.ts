import {SerializedCookieJar} from 'tough-cookie'

import {Project, Self} from './api.js'

// Structure of the auth (~/.shipthis.auth.json) file
export interface AuthConfig {
  shipThisUser?: Self
  appleCookies?: SerializedCookieJar
}

// Structure of the project (./shipthis.json) file
export interface ProjectConfig {
  project?: Project
  shippedFilesGlobs?: string[]
  ignoredFilesGlobs?: string[]
}

export * from './api.js'
export * from './request.js'
