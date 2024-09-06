import path from 'path'
import fs from 'fs'
import {Command, Flags, Interfaces} from '@oclif/core'

import {auth} from '@cli/lib'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<(typeof BaseCommand)['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // add the --json flag
  static enableJsonFlag = true

  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {
    'log-level': Flags.option({
      default: 'info',
      helpGroup: 'GLOBAL',
      options: ['debug', 'warn', 'error', 'info', 'trace'] as const,
      summary: 'Specify level for logging.',
    })(),
  }

  protected flags!: Flags<T>
  protected args!: Args<T>

  public async init(): Promise<void> {
    await super.init()
    const {args, flags} = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      args: this.ctor.args,
      strict: this.ctor.strict,
    })
    this.flags = flags as Flags<T>
    this.args = args as Args<T>
  }

  protected async catch(err: Error & {exitCode?: number}): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }

  private getConfigPath(): string {
    return path.join(this.config.home, '.shipthis.auth.json')
  }

  public async getAuthConfig(): Promise<auth.AuthConfig> {
    const baseConfig = {} as auth.AuthConfig
    const configPath = this.getConfigPath()
    if (!fs.existsSync(configPath)) return baseConfig
    const raw = await fs.promises.readFile(configPath, 'utf8')
    const authConfig = JSON.parse(raw)
    return {
      ...baseConfig,
      ...authConfig,
    }
  }

  public async setAuthConfig(config: auth.AuthConfig): Promise<void> {
    const configPath = this.getConfigPath()
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2))
  }
}
