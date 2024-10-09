import {render} from 'ink'
import {Flags} from '@oclif/core'

import {App, StatusTable} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {isValidSemVer} from '@cli/utils/index.js'
import {GameEngine} from '@cli/types.js'

export default class GameDetails extends BaseGameCommand<typeof GameDetails> {
  static override args = {}

  static override description =
    'Shows and sets the details of a game. If --gameId is not provided it will look in the current directory.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
    '<%= config.bin %> <%= command.id %> --buildNumber 5 --semanticVersion 1.2.3',
    '<%= config.bin %> <%= command.id %> --gameEngine godot --gameEngineVersion 4.2 --force',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    force: Flags.boolean({char: 'f', description: 'Force the command to run'}),
    buildNumber: Flags.integer({char: 'b', description: 'Set the build number'}),
    semanticVersion: Flags.string({char: 's', description: 'Set the semantic version'}),
    gameEngine: Flags.string({char: 'e', description: 'Set the game engine'}),
    gameEngineVersion: Flags.string({char: 'v', description: 'Set the game engine version'}),
    iosBundleId: Flags.string({char: 'i', description: 'Set the iOS bundle ID'}),
    androidPackageName: Flags.string({char: 'a', description: 'Set the Android package name'}),
  }

  public async run(): Promise<void> {
    const {gameId, force, ...valueFlags} = this.flags

    const {semanticVersion, buildNumber, gameEngine, gameEngineVersion, iosBundleId, androidPackageName} = valueFlags

    if (semanticVersion && !isValidSemVer(semanticVersion))
      throw new Error(`Invalid semantic version: ${semanticVersion}`)

    if ((gameEngine || gameEngineVersion || iosBundleId || androidPackageName) && !force)
      throw new Error('Use --force to set the restricted fields')

    if (gameEngine && gameEngine !== GameEngine.GODOT) throw new Error(`Game engine ${gameEngine} not supported`)

    let game = await this.getGame()

    const update = {
      details: {
        ...game.details,
        ...(semanticVersion && {semanticVersion}),
        ...(buildNumber && {buildNumber}),
        ...(gameEngine && {gameEngine: gameEngine as GameEngine}),
        ...(gameEngineVersion && {gameEngineVersion}),
        ...(iosBundleId && {iosBundleId}),
        ...(androidPackageName && {androidPackageName}),
      },
    }

    if (Object.keys(valueFlags).length > 0) {
      game = await this.updateGame(update)
    }

    render(
      <App>
        <StatusTable
          title="Game Details"
          statuses={{
            'Game Engine': game.details?.gameEngine || 'Please set!',
            'Game Engine Version': game.details?.gameEngineVersion || 'Please set!',
            'iOS Bundle ID': game.details?.iosBundleId || 'N/A',
            'Android Package Name': game.details?.androidPackageName || 'N/A',
            'Semantic Version': game.details?.semanticVersion || '0.0.1',
            'Build Number': game.details?.buildNumber || 1,
          }}
        />
      </App>,
    )
    return
  }
}
