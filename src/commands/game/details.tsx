import {Flags} from '@oclif/core'
import {render} from 'ink'

import {BaseGameCommand, DetailsFlags} from '@cli/baseCommands/index.js'
import {Command, StatusTable} from '@cli/components/index.js'
import {GameEngine} from '@cli/types'
import {isValidSemVer} from '@cli/utils/index.js'

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
    const {force, gameId, ...valueFlags} = this.flags

    const {
      androidPackageName,
      buildNumber,
      gameEngine,
      gameEngineVersion,
      gcpProjectId,
      gcpServiceAccountId,
      iosBundleId,
      name,
      semanticVersion,
      useDemoCredentials,
    } = valueFlags

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
        ...(gcpProjectId && {gcpProjectId}),
        ...(gcpServiceAccountId && {gcpServiceAccountId}),
        ...(useDemoCredentials !== undefined && {useDemoCredentials: useDemoCredentials.toLowerCase() === 'true'}),
      },
      name: name || game.name,
    }

    if (Object.keys(valueFlags).length > 0) {
      game = await this.updateGame(update)
    }

    render(
      <Command command={this}>
        <StatusTable
          statuses={{
            'Android Package Name': game.details?.androidPackageName || 'N/A',
            'Build Number': game.details?.buildNumber || 1,
            'GCP Project ID': game.details?.gcpProjectId || 'N/A',
            'GCP Service Account ID': game.details?.gcpServiceAccountId || 'N/A',
            'Game Engine': game.details?.gameEngine || 'Please set!',
            'Game Engine Version': game.details?.gameEngineVersion || 'Please set!',
            'Game Name': game.name,
            'Semantic Version': game.details?.semanticVersion || '0.0.1',
            'iOS Bundle ID': game.details?.iosBundleId || 'N/A',
            'Using Demo Credentials': game.details?.useDemoCredentials ? 'Yes' : 'No',
          }}
          title="Game Details"
        />
      </Command>,
    )
    
  }
}
