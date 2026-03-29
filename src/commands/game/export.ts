import {Args, Flags} from '@oclif/core'

import {getProject} from '@cli/api/index.js'
import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {DEFAULT_PLATFORM_GLOBS} from '@cli/constants/index.js'
import {isCWDGodotGame} from '@cli/utils/index.js'

export default class GameExport extends BaseAuthenticatedCommand<typeof GameExport> {
  static override args = {
    game_id: Args.string({description: 'The ID of the game to export (use "list" to get the ID)', required: false}),
  }

  static override description = 'Downloads the shipthis.json file for a given game into the current directory.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> abcd1234',
    '<%= config.bin %> <%= command.id %> abcd1234 --force',
    '<%= config.bin %> <%= command.id %> --current --force',
  ]

  static override flags = {
    force: Flags.boolean({char: 'f'}),
    current: Flags.boolean({description: 'Use the project ID from the current shipthis.json config'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = this

    if (!isCWDGodotGame()) {
      return this.error('No Godot project detected. Please run this from a godot project directory.', {exit: 1})
    }

    if (this.hasProjectConfig() && !flags.force) {
      return this.error(
        'This project has already been initialized. Use --force to overwrite the existing configuration.',
        {exit: 1},
      )
    }

    if (flags.current && args.game_id) {
      return this.error('Please provide either game_id or --current, not both.', {exit: 1})
    }

    let gameId: string | undefined

    if (flags.current) {
      if (!this.hasProjectConfig()) {
        return this.error('No current project config found. Cannot use --current without shipthis.json.', {exit: 1})
      }

      gameId = this.getProjectConfigSafe().project?.id
      if (!gameId) return this.error('Current project config is missing project.id.', {exit: 1})
    } else {
      gameId = args.game_id
      if (!gameId) return this.error('Missing required argument game_id (or use --current).', {exit: 1})
    }

    const project = await getProject(gameId)

    await this.setProjectConfig({
      globs: DEFAULT_PLATFORM_GLOBS,
      project,
    })

    await this.config.runCommand('game:status')
    this.exit(0)
  }
}
