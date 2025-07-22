import fs from 'node:fs'
import path from 'node:path'

import {Command, Flags, Interfaces} from '@oclif/core'
import {SerializedCookieJar} from 'tough-cookie'

import {getSelf, setAuthToken} from '@cli/api/index.js'
import {Auth} from '@cli/apple/expo.js'
import {AUTH_ENV_VAR_NAME} from '@cli/constants/config.js'
import {AuthConfig, ProjectConfig} from '@cli/types'
import {isCWDGodotGame} from '@cli/utils/index.js'

import {DetailsFlags} from './index.js'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<(typeof BaseCommand)['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {}

  // add the --json flag
  static enableJsonFlag = false

  protected args!: Args<T>
  protected flags!: Flags<T>

  protected async catch(err: {exitCode?: number} & Error): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  // Used in baseGameCommand and the other commands that need to ensure that the CWD is a Godot project
  protected ensureWeAreInAProjectDir(): void {
    if (!isCWDGodotGame()) {
      this.error('No Godot project detected. Please run this from a godot project directory.', {exit: 1})
    }

    if (!this.hasProjectConfig()) {
      this.error(
        'No ShipThis config found. Please run `shipthis game create --name "Space Invaders"` to create a game.',
        {exit: 1},
      )
    }
  }

  protected ensureWeHaveAppleCookies(): void {
    if (!this.hasAuthConfigFile()) {
      this.error('You must be authenticated with Apple in to use this command. Please run shipthis apple login', {
        exit: 1,
      })
    }
  }

  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }

  // Used in the apple commands to get the cookies from the auth file
  protected async getAppleCookies(): Promise<SerializedCookieJar | null> {
    const authConfig = await this.getAuthConfig()
    if (!authConfig.appleCookies) return null
    return authConfig.appleCookies
  }

  // Returns the current auth config - prefers to use the env var
  public async getAuthConfig(): Promise<AuthConfig> {
    const envVarValue = process.env[AUTH_ENV_VAR_NAME]
    if (!envVarValue) return await this.getAuthConfigFromFile()

    setAuthToken(envVarValue)
    const self = await getSelf()
    const selfWithJwt = {
      ...self,
      jwt: envVarValue,
    }
    return {
      shipThisUser: selfWithJwt,
    }
  }

  // Loads the auth config from the file system
  public async getAuthConfigFromFile(): Promise<AuthConfig> {
    const baseConfig = {} as AuthConfig
    const configPath = this.getAuthConfigPath()
    if (!fs.existsSync(configPath)) return baseConfig
    const raw = await fs.promises.readFile(configPath, 'utf8')
    const parsed = JSON.parse(raw)

    if (parsed.shipThisUser) {
      setAuthToken(parsed.shipThisUser.jwt)
    }

    return {
      ...baseConfig,
      ...parsed,
    }
  }

  // This is used to expose the flags to the Android Wizard
  public getDetailsFlagsValues(): Record<string, string> {
    const keys = Object.keys(DetailsFlags)
    const values = {} as Record<string, string>
    for (const key of keys) {
      if (this.flags[key]) values[key] = this.flags[key]
    }

    return values
  }

  // Exposing it to the react components using the CommandContext
  public getFlags(): Flags<T> {
    return this.flags
  }

  public getGameId(): null | string {
    const {flags} = this
    if (flags.gameId) return flags.gameId
    const {project} = this.getProjectConfigSafe()
    if (!project) return null
    return project.id
  }

  public async getProjectConfig(): Promise<ProjectConfig> {
    if (!this.hasProjectConfig()) throw new Error('No project config found')
    return this.getProjectConfigSafe()
  }

  public getProjectConfigSafe(): ProjectConfig {
    if (!this.hasProjectConfig()) return {}
    const configPath = this.getProjectConfigPath()
    const raw = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(raw)
  }

  public hasAuthConfigFile(): boolean {
    const configPath = this.getAuthConfigPath()
    return fs.existsSync(configPath)
  }

  public hasProjectConfig(): boolean {
    const configPath = this.getProjectConfigPath()
    return fs.existsSync(configPath)
  }

  // Tests the apple cookies
  protected async hasValidAppleAuthState(): Promise<boolean> {
    try {
      await this.refreshAppleAuthState()
      return true
    } catch {
      return false
    }
  }

  public async init(): Promise<void> {
    // TODO: is this the best place?
    process.on('SIGINT', () => process.exit(0))
    process.on('SIGTERM', () => process.exit(0))

    await super.init()
    const {args, flags} = await this.parse({
      args: this.ctor.args,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      flags: this.ctor.flags,
      strict: this.ctor.strict,
    })
    this.flags = flags as Flags<T>
    this.args = args as Args<T>

    // We get the auth config once here so that the JWT is loaded
    const authConfig = await this.getAuthConfig()
  }

  public async isAuthenticated(): Promise<boolean> {
    const authConfig = await this.getAuthConfig()
    return Boolean(authConfig.shipThisUser?.jwt)
  }

  protected async refreshAppleAuthState(): Promise<any> {
    const cookies = await this.getAppleCookies()

    const rerunMessage = 'Please run shipthis apple login to authenticate with Apple.'

    if (!cookies) throw new Error(`No Apple cookies found. ${rerunMessage}`)
    const authState = await Auth.loginWithCookiesAsync(
      {
        cookies,
      },
      {},
    )
    if (!authState) throw new Error(`Failed to refresh Apple auth state. ${rerunMessage}`)
    return authState
  }

  protected async setAppleCookies(cookies: SerializedCookieJar): Promise<void> {
    const authConfig = await this.getAuthConfig()
    await this.setAuthConfig({...authConfig, appleCookies: cookies})
  }

  // This is called after login to persist the JWT and user details
  public async setAuthConfig(config: AuthConfig): Promise<void> {
    const configPath = this.getAuthConfigPath()
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2))
  }

  public async setProjectConfig(config: ProjectConfig): Promise<void> {
    const configPath = this.getProjectConfigPath()
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2))
  }

  public async updateProjectConfig(update: Partial<ProjectConfig>): Promise<void> {
    const config = await this.getProjectConfig()
    await this.setProjectConfig({...config, ...update})
  }

  // Returns the values of the flags in DetailsFlags
  private getAuthConfigPath(): string {
    // Hidden file in the user's home directory
    return path.join(this.config.home, '.shipthis.auth.json')
  }

  private getProjectConfigPath(): string {
    // Non-hidden file in the current working directory
    return path.join(process.cwd(), 'shipthis.json')
  }
}
