import {SerializedCookieJar} from 'tough-cookie'

import {Auth} from '@cli/apple/expo.js'

/**
 * We were doing this with the nativescript lib to give more control over user
 * input but Apple changed their auth so we use expo's apple utils for now.
 */
export async function getNewAuthState(username: string, password: string): Promise<any> {
  const authState = await Auth.loginAsync({
    password,
    username,
  })
  return authState
}

export async function getCurrentAuthState({appleCookies}: {appleCookies: SerializedCookieJar}): Promise<any> {
  if (!appleCookies) return null
  const authState = await Auth.loginWithCookiesAsync(
    {
      cookies: appleCookies,
    },
    {},
  )
  return authState
}
