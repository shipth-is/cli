import {Flags} from '@oclif/core'
import {promises as readline} from 'node:readline'

import {BaseCommand} from '@cli/baseCommands/index.js'
import {createProject} from '@cli/api/index.js'

export default class GameCreate extends BaseCommand<typeof GameCreate> {
  static override args = {}

  static override description = 'Create a new ShipThis game'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    force: Flags.boolean({char: 'f'}),
    name: Flags.string({char: 'n', description: 'The name of the game'}),
  }

  public async run(): Promise<void> {
    const {flags} = this

    const authConfig = await this.getAuthConfig()
    if (!authConfig.shipThisUser) {
      throw new Error('You must be logged in to create a game. Run `shipthis login` to authenticate.')
    }

    if (this.hasProjectConfig() && !flags.force) {
      throw new Error('This directory already has a ShipThis project. Use --force to overwrite.')
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const getName = async (): Promise<string> => {
      if (flags.name) return flags.name
      const name = await rl.question('Please enter the name of the game: ')
      if (!name) throw new Error('Game name is required')
      return name
    }

    const name = await getName()
    const project = await createProject(name)

    await this.setProjectConfig({project})
    await this.config.runCommand('game:status')
    this.exit(0)
  }
}
