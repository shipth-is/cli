import {Command} from '@oclif/core'
import {BaseGameCommand} from './baseGameCommand.js'
import {generatePackageName, getGodotAndroidPackageName, getInput} from '@cli/utils/index.js'
import {getGoogleStatus} from '@cli/api/index.js'

export abstract class BaseGameAndroidCommand<T extends typeof Command> extends BaseGameCommand<T> {
  public async init(): Promise<void> {
    await super.init()
    // TODO: when is the right time to confirm this with the user?
    // Do users change this at all?
    await this.ensureWeHaveAndroidPackageName()
  }

  // Prompts the user for the Android package name
  protected async getAndroidPackageName(gameId: string): Promise<string> {
    const game = await this.getGame()
    const generated = generatePackageName(game.name)
    const suggested = game.details?.iosBundleId || getGodotAndroidPackageName() || generated || 'com.example.game'
    const question = `Please enter the Android Package Name, or press enter to use ${suggested}: `
    const entered = await getInput(question)
    return entered || suggested
  }

  // Forces us to have the androidPackageName in the game details
  protected async ensureWeHaveAndroidPackageName(): Promise<void> {
    const game = await this.getGame()
    if (!game.details?.androidPackageName) {
      const androidPackageName = await this.getAndroidPackageName(game.id)
      await this.updateGame({details: {...game.details, androidPackageName}})
    }
  }

  protected async checkGoogleAuth(waitForAuth = false): Promise<void> {
    let status = await getGoogleStatus()
    if (status.isAuthenticated) return

    if (!waitForAuth)
      this.error('You must connect to Google first. Run `shipthis game android apiKey connect`', {exit: 1})

    this.log('Waiting for Google authentication...')
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    for (let i = 0; i < 600; i++) {
      process.stdout.write('.')
      await sleep(1000 * 10)
      status = await getGoogleStatus()
      if (status.isAuthenticated) return
    }

    this.error('Google authentication failed. Please try again.', {exit: 1})
  }
}
