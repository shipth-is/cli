import {Command} from '@oclif/core'

import {BaseCommand} from './baseCommand.js'

export abstract class BaseAuthenticatedCommand<T extends typeof Command> extends BaseCommand<T> {
  static override flags = {}

  public async init(): Promise<void> {
    await super.init()
    if (!this.hasAuthConfig()) {
      this.error('No auth config found. Please run `shipthis login` to authenticate.', {exit: 1})
    }
  }
}
