import {Args, Flags} from '@oclif/core'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {isCWDGodotGame} from '@cli/utils/index.js'
import {getProject} from '@cli/api/index.js'
import {DEFAULT_SHIPPED_FILES_GLOBS, DEFAULT_IGNORED_FILES_GLOBS} from '@cli/constants/index.js'

export default class GameExport extends BaseAuthenticatedCommand<typeof GameExport> {
  static override args = {
    gameId: Args.string({description: 'The ID of the game to export (use "list" to get the ID)'}),
  }

  static override description = 'Downloads the shipthis.json file for a given game into the current directory.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> abcd1234',
    '<%= config.bin %> <%= command.id %> abcd1234 --force',
  ]

  static override flags = {
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const {args} = this

    if (!args.gameId) {
      return this.error('Please provide a game ID.', {exit: 1})
    }

    if (!isCWDGodotGame()) {
      return this.error('No Godot project detected. Please run this from a godot project directory.', {exit: 1})
    }

    if (this.hasProjectConfig() && !this.flags.force) {
      return this.error(
        'This project has already been initialized. Use --force to overwrite the existing configuration.',
        {exit: 1},
      )
    }

    const project = await getProject(args.gameId)

    await this.setProjectConfig({
      project,
      shippedFilesGlobs: DEFAULT_SHIPPED_FILES_GLOBS,
      ignoredFilesGlobs: DEFAULT_IGNORED_FILES_GLOBS,
    })

    await this.config.runCommand('game:status')
    this.exit(0)
  }
}
