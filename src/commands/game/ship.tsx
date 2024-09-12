import {v4 as uuid} from 'uuid'
import axios from 'axios'
import fg from 'fast-glob'
import fs from 'fs'
import yazl from 'yazl'

import {BaseGameCommand} from '@cli/baseCommands/baseGameCommand.js'
import {ProjectConfig} from '@cli/types.js'
import {DEFAULT_SHIPPED_FILES_GLOBS, DEFAULT_IGNORED_FILES_GLOBS} from '@cli/config.js'
import {getNewUploadTicket, startJobsFromUpload} from '@cli/api/index.js'

// Only works if in a game dir - so extends BaseGameCommand
export default class GameShip extends BaseGameCommand<typeof GameShip> {
  static override args = {}

  static override description = 'Builds the app (for all platforms with valid credentials) and ships it to the stores'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const projectConfig: ProjectConfig = await this.getProjectConfig()
    if (!projectConfig) throw new Error('No project config found')
    if (!projectConfig.project) throw new Error('No project found in project config')

    const shippedFilesGlobs = projectConfig.shippedFilesGlobs || DEFAULT_SHIPPED_FILES_GLOBS
    const ignoredFilesGlobs = projectConfig.ignoredFilesGlobs || DEFAULT_IGNORED_FILES_GLOBS

    const files = await fg(shippedFilesGlobs, {dot: true, ignore: ignoredFilesGlobs})

    const zipFile = new yazl.ZipFile()

    for (const file of files) {
      zipFile.addFile(file, file)
    }

    const outputZipToFile = (zip: yazl.ZipFile, fileName: string) =>
      new Promise<void>((resolve) => {
        const outputStream = fs.createWriteStream(fileName)
        zip.outputStream.pipe(outputStream).on('close', () => resolve())
        zip.end()
      })

    const tmpZipFile = `${process.cwd()}/shipthis-${uuid()}.zip`
    await outputZipToFile(zipFile, tmpZipFile)
    const zipBuffer = fs.readFileSync(tmpZipFile)
    const {size} = fs.statSync(tmpZipFile)

    const uploadTicket = await getNewUploadTicket(projectConfig.project.id)

    await axios.put(uploadTicket.url, zipBuffer, {
      headers: {
        'Content-length': size,
        'Content-Type': 'application/zip',
      },
    })

    await startJobsFromUpload(uploadTicket.id)

    // TODO: show the status

    // TODO: websocket output

    // TODO: no watch fla
  }
}
