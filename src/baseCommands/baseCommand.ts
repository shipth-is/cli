import path from 'path'
import fs from 'fs'
import {SerializedCookieJar} from 'tough-cookie'
import {Command, Flags, Interfaces} from '@oclif/core'

import {AuthConfig, ProjectConfig} from '@cli/types.js'
import {setAuthToken} from '@cli/api/index.js'
import {isCWDGodotGame} from '@cli/utils/index.js'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<(typeof BaseCommand)['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // add the --json flag
  static enableJsonFlag = false

  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {}

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

    if (this.hasAuthConfig()) await this.loadAuthConfig()
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

  private getAuthConfigPath(): string {
    // Hidden file in the user's home directory
    return path.join(this.config.home, '.shipthis.auth.json')
  }

  public hasAuthConfig(): boolean {
    const configPath = this.getAuthConfigPath()
    return fs.existsSync(configPath)
  }

  public async getAuthConfig(): Promise<AuthConfig> {
    const baseConfig = {} as AuthConfig
    const configPath = this.getAuthConfigPath()
    if (!fs.existsSync(configPath)) return baseConfig
    const raw = await fs.promises.readFile(configPath, 'utf8')
    const typesConfig = JSON.parse(raw)
    return {
      ...baseConfig,
      ...typesConfig,
    }
  }

  public async setAuthConfig(config: AuthConfig): Promise<void> {
    const configPath = this.getAuthConfigPath()
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2))
  }

  public async loadAuthConfig(): Promise<void> {
    const authConfig = await this.getAuthConfig()
    if (!authConfig.shipThisUser) {
      throw new Error('You must be logged in to use this command')
    }
    // This sets the auth token for all API requests
    setAuthToken(authConfig.shipThisUser.jwt)
  }

  private getProjectConfigPath(): string {
    // Non-hidden file in the current working directory
    return path.join(process.cwd(), 'shipthis.json')
  }

  public hasProjectConfig(): boolean {
    const configPath = this.getProjectConfigPath()
    return fs.existsSync(configPath)
  }

  public async getProjectConfig(): Promise<ProjectConfig> {
    if (!this.hasProjectConfig()) throw new Error('No project config found')
    const configPath = this.getProjectConfigPath()
    const raw = await fs.promises.readFile(configPath, 'utf8')
    return JSON.parse(raw)
  }

  public async setProjectConfig(config: ProjectConfig): Promise<void> {
    const configPath = this.getProjectConfigPath()
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2))
  }

  // Used in baseGameCommand and the other commands that need to ensure that the CWD is a Godot project
  protected ensureWeAreInAProjectDir(): void {
    if (!isCWDGodotGame()) {
      this.error('No Godot project detected. Please run this from a godot project directory.', {exit: 1})
    }

    if (!this.hasProjectConfig()) {
      this.error(
        'No shipthis config found. Please run `shipthis game create --name "Space Invaders"` to create a game.',
        {exit: 1},
      )
    }
  }

  // Used in the apple commands to get the cookies from the auth file
  protected async getAppleCookies(): Promise<SerializedCookieJar | null> {
    const authConfig = await this.getAuthConfig()
    if (!authConfig.appleCookies) return null
    return authConfig.appleCookies
  }

  protected async setAppleCookies(cookies: SerializedCookieJar): Promise<void> {
    const authConfig = await this.getAuthConfig()
    await this.setAuthConfig({...authConfig, appleCookies: cookies})
  }

  protected ensureWeHaveAppleCookies(): void {
    if (!this.hasAuthConfig()) {
      this.error('You must be authenticated with Apple in to use this command. Please run shipthis apple login', {
        exit: 1,
      })
    }
  }
}
