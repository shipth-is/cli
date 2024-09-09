import {CookieJar} from 'tough-cookie'

export interface Self {
  id: string
  email: string
  createdAt: string
  updatedAt: string
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
  createdAt: string
  updatedAt: string
}

// Structure of the JSON project config file
export interface ProjectConfig {
  project?: Project
}

export enum Platform {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
}
