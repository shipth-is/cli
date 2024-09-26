import {render} from 'ink'
import {Flags} from '@oclif/core'

import {App, StatusTable} from '@cli/components/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {isValidSemVer} from '@cli/utils/index.js'

export default class GameVersion extends BaseGameCommand<typeof GameVersion> {
  static override args = {}

  static override description =
    'Shows and sets the game semantic version and build number. If --gameId is not provided it will look in the current directory.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
    '<%= config.bin %> <%= command.id %> --setBuildNumber 5 --setSemanticVersion 1.2.3',
  ]

  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
    setBuildNumber: Flags.integer({char: 'b', description: 'Set the build number'}),
    setSemanticVersion: Flags.string({char: 's', description: 'Set the semantic version'}),
  }

  public async run(): Promise<void> {
    const {setSemanticVersion, setBuildNumber} = this.flags

    if (setSemanticVersion && !isValidSemVer(setSemanticVersion))
      throw new Error(`Invalid semantic version: ${setSemanticVersion}`)

    let game = await this.getGame()

    const update = {
      details: {
        ...game.details,
        ...(setSemanticVersion && {semanticVersion: setSemanticVersion}),
        ...(setBuildNumber && {buildNumber: setBuildNumber}),
      },
    }

    if (setSemanticVersion || setBuildNumber) {
      game = await this.updateGame(update)
    }

    render(
      <App>
        <StatusTable
          title="Version Information"
          statuses={{
            'Semantic Version': game.details?.semanticVersion || '0.0.1',
            'Build Number': game.details?.buildNumber || 1,
          }}
        />
      </App>,
    )
    return
  }
}
