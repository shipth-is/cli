import {render} from 'ink'
import {Flags} from '@oclif/core'

import {Command, StatusTable} from '@cli/components/index.js'
import {BaseGameCommand, DetailsFlags} from '@cli/baseCommands/index.js'
import {isValidSemVer} from '@cli/utils/index.js'
import {GameEngine} from '@cli/types'

export default class GameDetails extends BaseGameCommand<typeof GameDetails> {
  static override args = {}

  static override description = 'Shows and sets the details of a game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
    '<%= config.bin %> <%= command.id %> --buildNumber 5 --semanticVersion 1.2.3',
    '<%= config.bin %> <%= command.id %> --gameEngine godot --gameEngineVersion 4.2 --force',
  ]

  static override flags = {
    ...BaseGameCommand.flags,
    force: Flags.boolean({char: 'f', description: 'Force the command to run'}),
    ...DetailsFlags,
  }

  public async run(): Promise<void> {
    const {gameId, force, ...valueFlags} = this.flags

    const {
      name,
      semanticVersion,
      buildNumber,
      gameEngine,
      gameEngineVersion,
      iosBundleId,
      androidPackageName,
      gcpProjectId,
      gcpServiceAccountId,
    } = valueFlags

    if (semanticVersion && !isValidSemVer(semanticVersion))
      throw new Error(`Invalid semantic version: ${semanticVersion}`)

    if ((gameEngine || gameEngineVersion || iosBundleId || androidPackageName) && !force)
      throw new Error('Use --force to set the restricted fields')

    if (gameEngine && gameEngine !== GameEngine.GODOT) throw new Error(`Game engine ${gameEngine} not supported`)

    let game = await this.getGame()

    const update = {
      name: name || game.name,
      details: {
        ...game.details,
        ...(semanticVersion && {semanticVersion}),
        ...(buildNumber && {buildNumber}),
        ...(gameEngine && {gameEngine: gameEngine as GameEngine}),
        ...(gameEngineVersion && {gameEngineVersion}),
        ...(iosBundleId && {iosBundleId}),
        ...(androidPackageName && {androidPackageName}),
        ...(gcpProjectId && {gcpProjectId}),
        ...(gcpServiceAccountId && {gcpServiceAccountId}),
      },
    }

    if (Object.keys(valueFlags).length > 0) {
      game = await this.updateGame(update)
    }

    render(
      <Command command={this}>
        <StatusTable
          title="Game Details"
          statuses={{
            'Game Name': game.name,
            'Game Engine': game.details?.gameEngine || 'Please set!',
            'Game Engine Version': game.details?.gameEngineVersion || 'Please set!',
            'iOS Bundle ID': game.details?.iosBundleId || 'N/A',
            'Android Package Name': game.details?.androidPackageName || 'N/A',
            'Semantic Version': game.details?.semanticVersion || '0.0.1',
            'Build Number': game.details?.buildNumber || 1,
            'GCP Project ID': game.details?.gcpProjectId || 'N/A',
            'GCP Service Account ID': game.details?.gcpServiceAccountId || 'N/A',
          }}
        />
      </Command>,
    )
    return
  }
}
