import tough, {SerializedCookieJar} from 'tough-cookie'

import {ApplePortalCookieService} from 'nativescript/lib/services/apple-portal/apple-portal-cookie-service.js'
import {ApplePortalSessionService} from 'nativescript/lib/services/apple-portal/apple-portal-session-service.js'
import {Config} from 'nativescript/lib/common/definitions/config.js'
import {HttpClient} from 'nativescript/lib/common/http-client.js'
import {IErrors, IFailOptions} from 'nativescript/lib/common/declarations.js'

// TODO: why is this import like this?
import {Auth} from '@cli/apple/expo.js'

interface ILogger {
  initialize(opts?: any): void
  initializeCliLogger(opts?: any): void
  getLevel(): string
  fatal(formatStr?: any, ...args: any[]): void
  error(formatStr?: any, ...args: any[]): void
  warn(formatStr?: any, ...args: any[]): void
  info(formatStr?: any, ...args: any[]): void
  debug(formatStr?: any, ...args: any[]): void
  trace(formatStr?: any, ...args: any[]): void
  printMarkdown(...args: any[]): void
  prepare(item: any): string
  isVerbose(): boolean
  clearScreen(): void
}

class Logger implements ILogger {
  initialize(opts?: any): void {}
  initializeCliLogger(opts?: any): void {}
  getLevel(): string {
    return 'info'
  }
  fatal(formatStr?: any, ...args: any[]): void {
    console.error(formatStr, ...args)
  }
  error(formatStr?: any, ...args: any[]): void {
    console.error(formatStr, ...args)
  }
  warn(formatStr?: any, ...args: any[]): void {
    console.warn(formatStr, ...args)
  }
  info(formatStr?: any, ...args: any[]): void {
    // console.log(formatStr, ...args);
  }
  debug(formatStr?: any, ...args: any[]): void {
    // console.log(formatStr, ...args);
  }
  trace(formatStr?: any, ...args: any[]): void {
    // console.trace(formatStr, ...args);
  }
  printMarkdown(...args: any[]): void {
    // console.log("Printing markdown");
  }
  prepare(item: any): string {
    return 'Preparing item'
  }
  isVerbose(): boolean {
    return false
  }
  clearScreen(): void {}
}

class NullProxy {
  getCache(): null {
    return null // Type declaration is wrong
  }
}

class Errors implements IErrors {
  fail(formatStr: string, ...args: any[]): never
  fail(opts: IFailOptions, ...args: any[]): never
  fail(opts: unknown, ...args: unknown[]): never {
    throw new Error('Method not implemented.')
  }
  failWithoutHelp(message: string, ...args: any[]): never
  failWithoutHelp(opts: IFailOptions, ...args: any[]): never
  failWithoutHelp(opts: unknown, ...args: unknown[]): never {
    throw new Error('Method not implemented.')
  }
  failWithHelp(formatStr: string, ...args: any[]): never
  failWithHelp(opts: IFailOptions, ...args: any[]): never
  failWithHelp(opts: unknown, ...args: unknown[]): never {
    throw new Error('Method not implemented.')
  }
  beginCommand(action: () => Promise<boolean>, printCommandHelp: () => Promise<void>): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  verifyHeap(message: string): void {
    throw new Error('Method not implemented.')
  }
  printCallStack = true
}

class DefaultConfig implements Config.IStaticConfig {
  USER_AGENT_NAME = '@shipthis.cc/cli'
  CLIENT_NAME = '@shipthis.cc/cli'
  version = '1.0.0'
}

export async function getNewAuthState(
  username: string,
  password: string,
  requestOtp: () => Promise<string>,
): Promise<any> {
  const cookieService = new ApplePortalCookieService()
  const errors = new Errors()
  const nullProxy = new NullProxy()
  const logger = new Logger()
  const config = new DefaultConfig()
  const httpClient = new HttpClient(logger, nullProxy, config)

  class CodeGobblingPrompter {
    async getString(prompt: string, options?: any): Promise<string> {
      return await requestOtp()
    }
  }

  const prompter = new CodeGobblingPrompter()

  const applePortalSessionService = new ApplePortalSessionService(cookieService, errors, httpClient, logger, prompter)

  console.log('creating user session')
  const session = await applePortalSessionService.createUserSession({
    username,
    password,
  })

  console.log('session', session)

  const cookieJar = new tough.CookieJar()

  const allRawCookies = session.userSessionCookie.split('; ')

  console.log(JSON.stringify(allRawCookies, null, 2))

  const getCookieUrl = (name: string) => {
    console.log('getCookieUrl name', name)
    if (name === 'myacinfo') return 'https://apple.com'
    if (name === 'dqsid') return 'https://appstoreconnect.apple.com'
    return 'https://idmsa.apple.com'
  }

  for (let rawCookie of allRawCookies) {
    const parsed = tough.parse(rawCookie)
    if (!parsed) throw new Error(`Unable to parse ${rawCookie}`)
    await cookieJar.setCookie(parsed, getCookieUrl(parsed.key))
  }

  const serialized = cookieJar.serializeSync()
  if (!serialized) throw new Error('Unable to serialize cookies')

  const hackedCookies = serialized.cookies.map((cookie) => {
    return {
      ...cookie,
      hostOnly: false, // Wont work without this hack
    }
  })

  const fixed = {
    ...serialized,
    cookies: hackedCookies,
  }

  // TODO: re-auth didnt work
  console.log(JSON.stringify(fixed, null, 2))

  console.log(['About to call expo func'])
  const authState = await Auth.loginWithCookiesAsync({
    cookies: fixed,
  })

  return authState
}

export async function getCurrentAuthState({appleCookies}: {appleCookies: SerializedCookieJar}): Promise<any> {
  if (!appleCookies) return null

  // TODO: re-implement this so it does not output anything?
  const authState = await Auth.loginWithCookiesAsync(
    {
      cookies: appleCookies,
    },
    {},
  )
  return authState
}
