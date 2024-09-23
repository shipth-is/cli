import {Flags} from '@oclif/core'
import {promises as readline} from 'node:readline'

import {BaseAuthenticatedCommand} from '@cli/baseCommands/index.js'
import {createProject} from '@cli/api/index.js'

import {DEFAULT_SHIPPED_FILES_GLOBS, DEFAULT_IGNORED_FILES_GLOBS} from '@cli/constants/index.js'
import {getGodotProjectName} from '@cli/utils/godot.js'

export default class GameCreate extends BaseAuthenticatedCommand<typeof GameCreate> {
  static override args = {}

  static override description = 'Create a new game'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    force: Flags.boolean({char: 'f'}),
    name: Flags.string({char: 'n', description: 'The name of the game'}),
  }

  public async run(): Promise<void> {
    const {flags} = this

    if (this.hasProjectConfig() && !flags.force) {
      throw new Error('This directory already has a ShipThis project. Use --force to overwrite.')
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const getName = async (): Promise<string> => {
      if (flags.name) return flags.name
      const suggested = getGodotProjectName() || 'My Awesome Game'
      const name = await rl.question(`Please enter the name of the game, or press enter to use ${suggested}: `)
      return name || suggested
    }

    const name = await getName()
    const project = await createProject(name)

    await this.setProjectConfig({
      project,
      shippedFilesGlobs: DEFAULT_SHIPPED_FILES_GLOBS,
      ignoredFilesGlobs: DEFAULT_IGNORED_FILES_GLOBS,
    })
    await this.config.runCommand('game:status')
    this.exit(0)
  }
}
