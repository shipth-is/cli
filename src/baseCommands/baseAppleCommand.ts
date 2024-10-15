import {Command} from '@oclif/core'
import {BaseAuthenticatedCommand} from './baseAuthenticatedCommand.js'

export abstract class BaseAppleCommand<T extends typeof Command> extends BaseAuthenticatedCommand<T> {
  public async init(): Promise<void> {
    await super.init()
    await this.ensureWeHaveAppleCookies()
  }
}
