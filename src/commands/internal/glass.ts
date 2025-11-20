import { BaseCommand } from '@cli/baseCommands/baseCommand.js'
import {Args, Command, Flags} from '@oclif/core'
import * as fs from "node:fs";
import * as path from "node:path";
import xcode from "xcode";


export interface ApplyLiquidGlassIconOptions {
  projectDir: string; // Xcode project root path
  iconDir: string;    // path to the .icon folder
  loggers: {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
  };
}

export async function applyLiquidGlassIcon(opts: ApplyLiquidGlassIconOptions) {
  const { projectDir, iconDir, loggers } = opts;
  const { info, warn, error } = loggers;

  info(`Applying Liquid Glass icon from: ${iconDir}`);

  //
  // 1. Validate project directory
  //
  if (!fs.existsSync(projectDir)) {
    throw new Error(`Xcode project directory not found: ${projectDir}`);
  }

  const pbxprojPath = path.join(
    projectDir,
    "project.pbxproj"
  );

  if (!fs.existsSync(pbxprojPath)) {
    throw new Error(`project.pbxproj not found at: ${pbxprojPath}`);
  }

  //
  // 2. Validate icon directory
  //
  if (!fs.existsSync(iconDir)) {
    throw new Error(`Icon directory not found: ${iconDir}`);
  }

  const folderName = path.basename(iconDir);           // Example: MyIcon.icon
  const appIconName = folderName.replace(/\.icon$/i, ""); // Example: MyIcon

  info(`Detected icon folder name: ${folderName}`);
  info(`Derived app icon name: ${appIconName}`);

  //
  // 3. Parse Xcode project
  //
  info(`Loading Xcode project at: ${pbxprojPath}`);
  const project = xcode.project(pbxprojPath);

  try {
    project.parseSync();
  } catch (e) {
    error(`Failed to parse project.pbxproj: ${(e as Error).message}`);
    throw e;
  }

  //
  // 4. Add folder reference (blue folder)
  //
  info(`Adding folder reference to Resources: ${folderName}`);

  const result = project.addResourceFile(
    folderName,
    { lastKnownFileType: "folder" },
    "Resources",
    iconDir
  );

  if (!result) {
    warn(`Folder reference may already exist or could not be added: ${folderName}`);
  }

  //
  // 5. Update build settings for all configurations
  //
  info(`Updating build settings for app icon: ${appIconName}`);

  const configs = project.pbxXCBuildConfigurationSection();
  let configCount = 0;

  for (const key in configs) {
    const cfg = configs[key];
    if (!cfg || typeof cfg !== "object" || !cfg.buildSettings) continue;

    cfg.buildSettings["ASSETCATALOG_COMPILER_APPICON_NAME"] = appIconName;
    cfg.buildSettings["ASSETCATALOG_COMPILER_INCLUDE_ALL_APPICON_ASSETS"] = "YES";
    configCount++;
  }

  info(`Updated ${configCount} build configurations`);

  //
  // 6. Save project
  //
  info("Saving updated project.pbxproj...");
  fs.writeFileSync(pbxprojPath, project.writeSync());

  info(`Liquid Glass icon successfully applied.`);
}



export default class InternalGlass extends BaseCommand<typeof InternalGlass> {
  static override description = 'Apply a Liquid Glass .icon folder to a local Xcode project'

  static override flags = {
    project: Flags.string({
      required: true,
      description: 'Path to the Xcode project directory (e.g. ios/ or MyGame.xcodeproj)',
    }),

    icon: Flags.string({
      required: true,
      description: 'Path to the Liquid Glass AppIcon.icon bundle',
    }),

    verbose: Flags.boolean({
      default: false,
      description: 'Enable verbose logging',
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(InternalGlass)

    const projectPath = flags.project
    const iconPath = flags.icon
    const verbose = flags.verbose

    if (verbose) {
      this.log(`Project: ${projectPath}`)
      this.log(`Icon: ${iconPath}`)
    }

    await applyLiquidGlassIcon({
      projectDir: projectPath,
      iconDir: iconPath,
      loggers: {
        info: (msg: string) => this.log(msg),
        warn: (msg: string) => this.warn(msg),
        error: (msg: string) => this.error(msg),
      },
    })


    this.log('Liquid Glass icon applied.')
  }
}

