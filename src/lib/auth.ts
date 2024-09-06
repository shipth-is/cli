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
