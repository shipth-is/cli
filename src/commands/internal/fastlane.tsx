import fs, {promises as fsAsync} from 'node:fs'
import path from 'node:path'

import {Args, Flags} from '@oclif/core'

import {BaseCommand} from '@cli/baseCommands/index.js'

type Cookie = {
  creation: string
  domain: string
  expires?: string
  hostOnly?: boolean
  httpOnly?: boolean
  key: string
  lastAccessed: string
  maxAge?: number
  path: string
  secure?: boolean
  value: string
}

type CookieFile = {
  cookies: Cookie[]
  rejectPublicSuffixes: boolean
  storeType: string
  version: string
}

function generateFastlaneSession(cookieData: CookieFile): string {
  return cookieData.cookies
    .map((cookie) => `- !ruby/object:HTTP::Cookie
  name: ${cookie.key}
  value: ${cookie.value}
  domain: ${cookie.domain}
  for_domain: ${cookie.hostOnly ? 'false' : 'true'}
  path: "${cookie.path}"
  secure: ${cookie.secure || false}
  httponly: ${cookie.httpOnly || false}
  expires: ${cookie.expires ? `"${cookie.expires}"` : ''}
  max_age: ${cookie.maxAge || ''}
  created_at: ${cookie.creation}
  accessed_at: ${cookie.lastAccessed}`)
    .join('\n')
}

export default class AppleFastlane extends BaseCommand<typeof AppleFastlane> {
  static override args = {
    file: Args.string({description: 'Path where the fastlane session will be written', required: true}),
    username: Args.string({description: 'Your Apple email address', required: true}),
  }

  static override description = 'Output a fastlane session file which can be used with xcodes'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --force --username me@email.nowhere',
  ]

  static override flags = {
    force: Flags.boolean({char: 'f'}),
  }

  public async run(): Promise<void> {
    const {args} = this
    const {file, username} = args

    const homeDirectory = this.config.home
    const inputFilePath = path.join(homeDirectory, '.app-store', 'auth', username, 'cookie')

    if (!fs.existsSync(inputFilePath)) {
      throw new Error(`No expo auth file found for ${username}`)
    }

    if (fs.existsSync(file) && !this.flags.force) {
      throw new Error(`The file ${file} already exists. Use --force to overwrite it.`)
    }

    // const outputFilePath = path.join(homeDirectory, '.fastlane', 'spaceship', username, 'cookie')
    const outputFilePath = file

    // Read and parse the JSON file
    const fileContent = await fsAsync.readFile(inputFilePath, 'utf8')
    const cookieData: CookieFile = JSON.parse(fileContent)

    // Generate the YAML content
    const yamlContent = generateFastlaneSession(cookieData)

    // Ensure the output directory exists
    await fsAsync.mkdir(path.dirname(outputFilePath), {recursive: true})

    // Write the YAML content to the output file
    await fsAsync.writeFile(outputFilePath, yamlContent, 'utf-8')

    console.log(`FASTLANE_SESSION written to ${outputFilePath}`)
  }
}
