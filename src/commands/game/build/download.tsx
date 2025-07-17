import * as fs from 'node:fs'

import {Args, Flags} from '@oclif/core'
import {render} from 'ink'

import {downloadBuildById} from '@cli/api/index.js'
import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {Command, RunWithSpinner} from '@cli/components/index.js'


export default class GameBuildDownload extends BaseGameCommand<typeof GameBuildDownload> {
  static override args = {
    build_id: Args.string({description: 'The ID of the build to download', required: true}),
    file: Args.string({description: 'Name of the file to output', required: true}),
  }

  static override description = 'Downloads the given build artifact to the specified file'

  static override examples = [
    '<%= config.bin %> <%= command.id %> 7a3f5c92 output.ipa',
    '<%= config.bin %> <%= command.id %> --gameId 0c179fc4 e4b9a3d7 output.apk',
  ]

  static override flags = {
    ...BaseGameCommand.flags,
    force: Flags.boolean({char: 'f', description: 'Overwrite the file if it already exists'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = this
    const {build_id, file} = args
    const {force} = flags

    const alreadyExists = fs.existsSync(file)
    if (alreadyExists && !force) {
      this.error(`The file ${file} already exists. Use --force to overwrite it.`)
    }

    const executeMethod = async () => {
      const game = await this.getGame()
      await downloadBuildById(game.id, build_id, file)
    }

    const handleComplete = async () => process.exit(0)

    render(
      <Command command={this}>
        <RunWithSpinner
          executeMethod={executeMethod}
          msgComplete={`Downloaded build artifact to ${file}`}
          msgInProgress={`Downloading to ${file}...`}
          onComplete={handleComplete}
        />
      </Command>,
    )
  }
}
