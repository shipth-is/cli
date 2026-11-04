import * as fs from 'node:fs'

import {Args, Flags} from '@oclif/core'

import {downloadEncryptionKey, getEncryptionKey} from '@cli/api/credentials/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {getErrorMessage} from '@cli/utils/errors.js'

export default class GameEncryptionExport extends BaseGameCommand<typeof GameEncryptionExport> {
  static override args = {
    file: Args.string({description: 'Name of the file to write the key to. Prints the key if not given'}),
  }

  static override description =
    'Prints the encryption key of a game, or writes it to a file, so you can use it in your own Godot exports.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> key.txt',
    '<%= config.bin %> <%= command.id %> key.txt --force',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4',
  ]

  static override flags = {
    ...BaseGameCommand.flags,
    force: Flags.boolean({char: 'f', description: 'Overwrite the file if it already exists'}),
  }

  public async run(): Promise<void> {
    const {file} = this.args
    const {force} = this.flags

    const game = await this.getGame()

    if (file && fs.existsSync(file) && !force) {
      this.error(`The file ${file} already exists. Use --force to overwrite it.`, {exit: 1})
    }

    const credential = await getEncryptionKey(game.id)
    if (!credential) {
      this.error('This game has no encryption key.', {
        exit: 1,
        suggestions: ['Run `shipthis game details --useEncryption true` to turn encryption on and make one'],
      })
    }

    let key: string
    try {
      key = await downloadEncryptionKey(credential.url)
    } catch (error) {
      this.error(getErrorMessage(error), {exit: 1})
    }

    if (!file) {
      this.log(key)
      return
    }

    // Remove the old file first. Writing into it would keep its mode, and this one must be 0600.
    if (force) fs.rmSync(file, {force: true})
    fs.writeFileSync(file, `${key}\n`, {flag: 'wx', mode: 0o600})
    this.log(`Encryption key ${credential.serialNumber} written to ${file}`)
  }
}
