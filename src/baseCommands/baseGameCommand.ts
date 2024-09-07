import {Command} from '@oclif/core'
import {BaseAuthenticatedCommand} from './baseAuthenticatedCommand.js'
import {isCWDGodotGame} from '@cli/utils/index.js'

export abstract class BaseGameCommand<T extends typeof Command> extends BaseAuthenticatedCommand<T> {
  public async init(): Promise<void> {
    await super.init()

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
}
