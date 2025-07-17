import {getProjectCredentials} from '@cli/api/credentials/index.js'
import {BaseGameAndroidCommand, BaseGameCommand} from '@cli/baseCommands/index.js'
import {CommandGame, ImportKeystore} from '@cli/components/index.js'
import {CredentialsType, Platform} from '@cli/types'
import {Args, Flags} from '@oclif/core'
import {render} from 'ink'
import * as fs from 'node:fs'

export default class GameAndroidKeyStoreImport extends BaseGameCommand<typeof GameAndroidKeyStoreImport> {
  static override args = {
    file: Args.string({
      description: 'Path to the ZIP file to import (must be in the same format as the export)',
      required: false,
    }),
  }

  static override description = 'Imports an Android Keystore to your ShipThis account for the specified game.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> path/to/import.zip -g abfd5b00',
    '<%= config.bin %> <%= command.id %> --jksFile path/to/file.jks --keystorePassword yourpass --keyPassword yourkeypass',
  ]

  static override flags = {
    ...BaseGameAndroidCommand.flags,
    force: Flags.boolean({
      char: 'f',
      description: 'Overwrite any existing keystore without confirmation',
    }),
    jksFile: Flags.string({description: 'Path to the JKS file to import (requires passwords)'}),
    keyPassword: Flags.string({
      description: 'Key alias password (required when using --jksFile)',
    }),
    keystorePassword: Flags.string({
      description: 'Keystore password (required when using --jksFile)',
    }),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const {args, flags} = this

    const zipFilePath = args.file
    const jksFilePath = flags.jksFile
    const {keyPassword, keystorePassword} = flags

    if (!zipFilePath && !jksFilePath) {
      this.error('You must provide either a ZIP file or a JKS file to import.')
    }

    if (zipFilePath && jksFilePath) {
      this.error('You cannot provide both a ZIP file and a JKS file.')
    }

    if (jksFilePath && (!keystorePassword || !keyPassword)) {
      // TODO: because of a godot restriction, these values must actually be the same?
      this.error('Both --keystorePassword and --keyPassword are required when importing a JKS file.')
    }

    const toTest = `${zipFilePath || jksFilePath}`
    const isFound = fs.existsSync(toTest)
    if (!isFound) {
      this.error(`The file ${toTest} does not exist.`)
    }

    const projectCredentials = await getProjectCredentials(game.id)
    const hasKeystore = projectCredentials.some(
      (cred) => cred.platform == Platform.ANDROID && cred.isActive && cred.type == CredentialsType.CERTIFICATE,
    )

    if (hasKeystore && !flags.force) {
      this.error('A Keystore is already set on this game. Use --force to overwrite it.')
    }

    const handleComplete = async () => {
      await this.config.runCommand(`game:android:keyStore:status`, ['--gameId', game.id])
    }

    render(
      <CommandGame command={this}>
        <ImportKeystore
          importKeystoreProps={{jksFilePath, keyPassword, keystorePassword, zipFilePath}}
          onComplete={handleComplete}
          onError={(e) => this.error(e)}
        />
      </CommandGame>,
    )
  }
}
