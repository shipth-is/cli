import {Command} from '@oclif/core'
import {BaseGameCommand} from './baseGameCommand.js'
import {generatePackageName, getGodotAndroidPackageName, getInput} from '@cli/utils/index.js'

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
}
