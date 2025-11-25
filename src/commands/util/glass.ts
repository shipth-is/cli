import {BaseCommand} from '@cli/baseCommands/baseCommand.js'
import {Args, Flags} from '@oclif/core'
import * as fs from 'node:fs'
import * as path from 'node:path'
import xcode from 'xcode'

export interface ApplyLiquidGlassIconOptions {
  projectDir: string
  iconDir: string
  verbose: boolean
}

export async function applyLiquidGlassIcon(opts: ApplyLiquidGlassIconOptions) {
  const {projectDir, iconDir, verbose} = opts

  const info = (msg: string) => {
    if (!verbose) return
    console.log(msg)
  }

  const warn = (msg: string) => console.warn(`Warning: ${msg}`)

  info(`Applying Liquid Glass icon from: ${iconDir}`)

  if (!fs.existsSync(projectDir)) {
    throw new Error(`projectDir not found: ${projectDir}`)
  }

  const pbxprojPath = path.join(projectDir, 'project.pbxproj')
  if (!fs.existsSync(pbxprojPath)) {
    throw new Error(`project.pbxproj not found at: ${pbxprojPath}`)
  }

  if (!fs.existsSync(iconDir)) {
    throw new Error(`Icon directory not found: ${iconDir}`)
  }

  const iconFolderName = path.basename(iconDir)
  const appIconName = iconFolderName.replace(/\.icon$/i, '')

  info(`Detected .icon folder: ${iconFolderName}`)
  info(`Derived app icon name: ${appIconName}`)

  // Copy into project root if not already present
  const projectRoot = path.dirname(projectDir)
  const destIconDir = path.join(projectRoot, iconFolderName)

  if (!fs.existsSync(destIconDir)) {
    info(`Copying .icon folder into project root: ${destIconDir}`)
    await fs.promises.cp(iconDir, destIconDir, {
      recursive: true,
    })
  } else {
    info(`Icon folder already exists in project root, skipping copy.`)
  }

  // Add the folder to the resources in the Xcode project
  const project = xcode.project(pbxprojPath)
  project.parseSync()
  info(`Adding folder reference to Copy Bundle Resources: ${iconFolderName}`)
  const firstProject = project.getFirstProject()
  const mainGroupId = firstProject.firstProject.mainGroup
  const mainGroup = project.getPBXGroupByKey(mainGroupId)

  const fileRef = project.addResourceFile(
    iconFolderName,
    {lastKnownFileType: 'folder.iconcomposer.icon'},
    mainGroup.name,
  )

  if (fileRef) {
    project.addToPbxResourcesBuildPhase(fileRef)
  } else {
    warn(`Folder reference may already exist in project: ${iconFolderName}`)
  }

  // Update all build configurations to use the new app icon
  const configs = project.pbxXCBuildConfigurationSection()
  let modified = 0

  info(`Updating build settings for app icon: ${appIconName}`)

  for (const key in configs) {
    const cfg = configs[key]
    if (!cfg || typeof cfg !== 'object' || !cfg.buildSettings) continue
    cfg.buildSettings['ASSETCATALOG_COMPILER_APPICON_NAME'] = appIconName
    cfg.buildSettings['ASSETCATALOG_COMPILER_INCLUDE_ALL_APPICON_ASSETS'] = 'YES'
    modified++
  }

  info(`Modified ${modified} build configurations`)
  info(`Writing updated project to ${pbxprojPath}`)
  fs.writeFileSync(pbxprojPath, project.writeSync())

  info(`Liquid Glass icon successfully applied.`)
}

export default class InternalGlass extends BaseCommand<typeof InternalGlass> {
  static override description = 'Apply a Liquid Glass .icon folder to a local Xcode project'

  static override flags = {
    verbose: Flags.boolean({
      default: false,
      description: 'Enable verbose logging',
    }),
  }

  static override args = {
    project: Args.string({
      description: 'Path to the .xcodeproj directory',
      required: true,
    }),
    icon: Args.string({
      description: 'Path to the .icon folder',
      required: true,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(InternalGlass)
    await applyLiquidGlassIcon({
      projectDir: args.project,
      iconDir: args.icon,
      verbose: flags.verbose,
    })
    this.log('Liquid Glass icon applied.')
  }
}
