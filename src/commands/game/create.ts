import {Flags} from '@oclif/core'

import {createProject, getSupportedGodotVersions} from '@cli/api/index.js'
import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {DEFAULT_PLATFORM_GLOBS, DetailsFlags} from '@cli/constants/index.js'
import {GameEngine, ProjectDetails} from '@cli/types'
import {getGodotProjectName, getGodotVersion, isCWDGodotGame} from '@cli/utils/godot.js'
import {DetailsValues, getInput, isSupportedGodotVersion, validateDetailsValues} from '@cli/utils/index.js'

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

    // create always needs the list: it checks the flag, and it warns about the version it
    // reads from project.godot. One call answers both.
    const godotVersions = await getSupportedGodotVersions()

    this.validateOrError(details, godotVersions)

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
    this.validateOrError({name}, godotVersions)

    const gameEngine = GameEngine.GODOT

    // A version the user typed is already checked above. A version we read from project.godot
    // only warns - an older CLI can have a list that the build server has moved past, and a
    // hard stop there would block a build the server can do.
    const detectedVersion = getGodotVersion()
    const gameEngineVersion = details.gameEngineVersion || detectedVersion

    // --quiet promises no output except interactions and errors, and this is neither.
    if (!quiet && !details.gameEngineVersion && !isSupportedGodotVersion(detectedVersion, godotVersions)) {
      this.warn(
        `Your project.godot targets Godot ${detectedVersion}, which is not in the list of versions ShipThis builds.\n` +
          `If the build fails, pin a supported version:\n\n` +
          `  shipthis game details --gameEngineVersion ${godotVersions.at(-1)} --force\n\n` +
          `See https://shipth.is/docs/guides/godot-versioning`,
      )
    }

    const projectDetails: ProjectDetails = {
      ...details,
      useDemoCredentials: details.useDemoCredentials === 'true',
      gameEngine,
      gameEngineVersion,
    }

    const project = await createProject({details: projectDetails, name})

    await this.setProjectConfig({
      globs: DEFAULT_PLATFORM_GLOBS,
      project,
    })

    if (!flags.quiet) await this.config.runCommand('game:status')
  }

  // Stops the command on the first bad value, with the docs link for that field.
  private validateOrError(values: DetailsValues, godotVersions: string[]): void {
    const error = validateDetailsValues(values, godotVersions)
    if (!error) return
    this.error(error.message, {exit: 1, ref: error.ref, suggestions: error.suggestions})
  }
}
