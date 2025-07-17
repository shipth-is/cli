import {createProject} from '@cli/api/index.js'
import {BaseAuthenticatedCommand, DetailsFlags} from '@cli/baseCommands/index.js'
import {DEFAULT_IGNORED_FILES_GLOBS, DEFAULT_SHIPPED_FILES_GLOBS} from '@cli/constants/index.js'
import {GameEngine, ProjectDetails} from '@cli/types'
import {getGodotProjectName, getGodotVersion, isCWDGodotGame} from '@cli/utils/godot.js'
import {getInput} from '@cli/utils/index.js'
import {Flags} from '@oclif/core'

export default class GameCreate extends BaseAuthenticatedCommand<typeof GameCreate> {
  static override args = {}

  static override description = 'Create a new game in ShipThis.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    force: Flags.boolean({char: 'f'}),
    quiet: Flags.boolean({char: 'q', description: 'Avoid output except for interactions and errors'}),
    ...DetailsFlags,
  }

  public async run(): Promise<void> {
    const {flags} = this

    const {force, name: flagName, quiet, ...details} = flags

    if (this.hasProjectConfig() && !force) {
      throw new Error('This directory already has a ShipThis project. Use --force to overwrite.')
    }

    if (!isCWDGodotGame()) {
      this.error('No Godot project detected. Please run this from a godot project directory.', {exit: 1})
    }

    const getName = async (): Promise<string> => {
      if (flagName) return flagName
      const suggested = getGodotProjectName() || 'My Awesome Game'
      const entered = await getInput(`Please enter the name of the game, or press enter to use ${suggested}: `)
      return entered || suggested
    }

    const name = await getName()

    const gameEngine = GameEngine.GODOT
    const gameEngineVersion = getGodotVersion()

    const projectDetails: ProjectDetails = {
      ...details,
      gameEngine,
      gameEngineVersion,
    }

    const project = await createProject({details: projectDetails, name})

    await this.setProjectConfig({
      ignoredFilesGlobs: DEFAULT_IGNORED_FILES_GLOBS,
      project,
      shippedFilesGlobs: DEFAULT_SHIPPED_FILES_GLOBS,
    })

    if (!flags.quiet) await this.config.runCommand('game:status')
  }
}
