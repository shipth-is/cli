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
  // 1. Validate paths
  //
  if (!fs.existsSync(projectDir)) {
    throw new Error(`projectDir not found: ${projectDir}`);
  }

  const pbxprojPath = path.join(projectDir, "project.pbxproj");
  if (!fs.existsSync(pbxprojPath)) {
    throw new Error(`project.pbxproj not found at: ${pbxprojPath}`);
  }

  if (!fs.existsSync(iconDir)) {
    throw new Error(`Icon directory not found: ${iconDir}`);
  }

  //
  // 2. Determine the name — MyIcon.icon -> MyIcon
  //
  const iconFolderName = path.basename(iconDir); // ExampleAppIcon.icon
  const appIconName = iconFolderName.replace(/\.icon$/i, "");

  info(`Detected .icon folder: ${iconFolderName}`);
  info(`Derived app icon name: ${appIconName}`);

  //
  // 3. Copy the folder into the Xcode project root
  //
  const projectRoot = path.dirname(projectDir); // e.g. output/
  const destIconDir = path.join(projectRoot, iconFolderName);

  if (!fs.existsSync(destIconDir)) {
    info(`Copying .icon folder into project root: ${destIconDir}`);

    await fs.promises.cp(iconDir, destIconDir, {
      recursive: true
    });
  } else {
    info(`Icon folder already exists in project root, skipping copy.`);
  }

  //
  // 4. Load the Xcode project
  //
  const project = xcode.project(pbxprojPath);
  project.parseSync();

  //
  // 5. Add Xcode folder reference (blue folder)
  //
  // IMPORTANT:
  // The resource path must be relative to the project root.
  //
  const relativeFolderName = iconFolderName; // correct for folder reference

  info(`Adding folder reference to Copy Bundle Resources: ${relativeFolderName}`);

  // FIX: use main group instead of "Resources"
  const firstProject = project.getFirstProject();
  const mainGroupId = firstProject.firstProject.mainGroup;
  const mainGroup = project.getPBXGroupByKey(mainGroupId);

  const fileRef = project.addResourceFile(
    relativeFolderName,
    { lastKnownFileType: "folder" },
    mainGroup.name
  );

  if (fileRef) {
    project.addToPbxResourcesBuildPhase(fileRef);
  }

  if (!fileRef) {
    warn(`Folder reference may already exist in project: ${relativeFolderName}`);
  }

  //
  // 6. Patch build settings
  //
  const configs = project.pbxXCBuildConfigurationSection();
  let modified = 0;

  info(`Updating build settings for app icon: ${appIconName}`);

  for (const key in configs) {
    const cfg = configs[key];
    if (!cfg || typeof cfg !== "object" || !cfg.buildSettings) continue;

    cfg.buildSettings["ASSETCATALOG_COMPILER_APPICON_NAME"] = appIconName;
    cfg.buildSettings["ASSETCATALOG_COMPILER_INCLUDE_ALL_APPICON_ASSETS"] = "YES";
    modified++;
  }

  info(`Modified ${modified} build configurations`);

  //
  // 7. Save project
  //
  info(`Writing updated project to ${pbxprojPath}`);
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

