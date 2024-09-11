import {Command} from '@oclif/core'
import {BaseAuthenticatedCommand} from './baseAuthenticatedCommand.js'

import * as expo from '@expo/apple-utils/build/index.js'

export abstract class BaseAppleCommand<T extends typeof Command> extends BaseAuthenticatedCommand<T> {
  public async init(): Promise<void> {
    await super.init()
    await this.ensureWeHaveAppleCookies()
  }

  // TODO: fix typing
  protected async refreshAuthState(): Promise<any> {
    const cookies = await this.getAppleCookies()

    const rerunMessage = 'Please run shipthis apple login to authenticate with Apple.'

    if (!cookies) throw new Error(`No Apple cookies found. ${rerunMessage}`)
    const authState = await expo.default.Auth.loginWithCookiesAsync(
      {
        cookies,
      },
      {},
    )
    if (!authState) throw new Error(`Failed to refresh Apple auth state. ${rerunMessage}`)
    return authState
  }
}
