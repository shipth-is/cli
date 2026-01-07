import fs from 'node:fs'
import path from 'node:path'

import {
  ConfigFile,
  findPreset,
  getBasePreset,
  getMajorVersion,
  loadExportPresets,
  mergePresets,
  type Platform as GodotPlatform,
  type GodotMajorVersion,
  saveExportPresets,
  ExportPresetsFile,
} from 'godot-export-presets'

import {CapabilityType} from '@cli/apple/expo.js'
import {Platform} from '@cli/types'

// Check if the current working directory is a Godot game
// TODO: allow for cwd override
export function isCWDGodotGame(): boolean {
  const cwd = process.cwd()
  const godotProject = path.join(cwd, 'project.godot')
  return fs.existsSync(godotProject)
}

// From the docs:
// capabilities/access_wifi=true
// capabilities/push_notifications=false
// From the source code:
// https://github.com/godotengine/godot/blob/b435551682f93cf49f606d260b28e13ff5526beb/platform/ios/export/export_plugin.cpp#L321
// r_options->push_back(ExportOption(PropertyInfo(Variant::BOOL, "capabilities/access_wifi"), false));
// r_options->push_back(ExportOption(PropertyInfo(Variant::BOOL, "capabilities/push_notifications"), false));
// r_options->push_back(ExportOption(PropertyInfo(Variant::BOOL, "capabilities/performance_gaming_tier"), false));
// r_options->push_back(ExportOption(PropertyInfo(Variant::BOOL, "capabilities/performance_a12"), false));

export const GODOT_CAPABILITIES = [
  // TODO: how about capabilities from godot extensions
  {key: 'capabilities/access_wifi', name: 'Access WiFi', type: CapabilityType.ACCESS_WIFI},
  {key: 'capabilities/push_notifications', name: 'Push Notifications', type: CapabilityType.PUSH_NOTIFICATIONS},
]

// Tells us which capabilities are enabled in the Godot project
export async function getGodotProjectCapabilities(platform: Platform) {
  const exportPresets = await getGodotExportPresets(platform)

  const options: Record<string, any> = exportPresets.options || {}

  const capabilities = []

  for (const capability of GODOT_CAPABILITIES) {
    if (!(capability.key in options)) continue
    if (`${options[capability.key]}`.toLocaleLowerCase() === 'true') capabilities.push(capability.type)
  }

  return capabilities
}

export function getGodotProjectConfig(): ConfigFile {
  const cwd = process.cwd()
  const projectGodotPath = path.join(cwd, 'project.godot')
  const projectGodotContent = fs.readFileSync(projectGodotPath, 'utf8')
  const configFile = new ConfigFile()
  const error = configFile.parse(projectGodotContent)
  if (error) {
    throw error
  }
  return configFile
}

export function getGodotProjectName(): null | string {
  try {
    const projectGodotConfig = getGodotProjectConfig()
    return (projectGodotConfig.get_value('application', 'config/name') as string) || null
  } catch {
    return null
  }
}

export async function getGodotAppleBundleIdentifier(): Promise<null | string> {
  try {
    const preset = await getGodotExportPresets(Platform.IOS)
    return (preset.options?.['application/bundle_identifier'] as string) || null
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getGodotAndroidPackageName(): Promise<null | string> {
  try {
    const preset = await getGodotExportPresets(Platform.ANDROID)
    return (preset.options?.['package/unique_name'] as string) || null
  } catch (error) {
    console.log(error)
    return null
  }
}

// TODO: is there a more reliable way to get the Godot version?
export function getGodotVersion(): string {
  const projectGodotConfig = getGodotProjectConfig()
  const features = projectGodotConfig.get_value('application', 'config/features') as string[]
  if (!features || features.length === 0) {
    return '3.6'
  }
  const [version] = features
  return version as string
}

export function getExportPresetsPath(): string {
  // Get the preset options from any export_presets.cfg if found
  const cwd = process.cwd()
  const filename = 'export_presets.cfg'
  const exportPresetsPath = path.join(cwd, filename)
  return exportPresetsPath
}

// TODO: any differences in the presets between v 3.X and 4.X?
export async function getGodotExportPresets(platform: Platform) {
  const {warn} = console

  // Get Godot version to determine which base preset to use
  const godotVersion = getGodotVersion()
  const majorVersion = getMajorVersion(godotVersion) as GodotMajorVersion

  // Convert Platform enum to Godot platform string
  const godotPlatform: GodotPlatform = platform === Platform.IOS ? 'iOS' : 'Android'

  // Get the base preset for this platform and version
  let presetConfig = getBasePreset(godotPlatform, majorVersion)

  // Get the preset options from any export_presets.cfg if found
  const exportPresetsPath = getExportPresetsPath()

  const isFound = fs.existsSync(exportPresetsPath)
  if (isFound) {
    try {
      const exportPresets = await loadExportPresets(exportPresetsPath)
      // Find the preset with the same platform
      const foundPreset = findPreset(exportPresets, {platform: godotPlatform})

      if (foundPreset) {
        // Merge the preset with base config
        presetConfig = mergePresets(presetConfig, foundPreset)
      } else {
        warn(`Preset ${platform} not found in ${exportPresetsPath} - will use defaults`)
      }
    } catch (error) {
      warn(`Error loading ${exportPresetsPath}: ${error} - will use defaults`)
    }
  } else {
    warn(`Export presets not found at ${exportPresetsPath} - will use defaults`)
  }

  return presetConfig
}

export function getGradleBuildOptionKey(majorVersion: GodotMajorVersion): string {
  return majorVersion === 4 ? 'gradle_build/use_gradle_build' : 'custom_build/use_custom_build'
}

// Tells us if Gradle build is enabled in export_presets.cfg
// This uses getGodotExportPresets which uses the base preset if no config file
// The base preset has Gradle enabled by default
export async function isGradleBuildEnabled(): Promise<boolean> {
  const godotVersion = getGodotVersion()
  const majorVersion = getMajorVersion(godotVersion) as GodotMajorVersion
  const preset = await getGodotExportPresets(Platform.ANDROID)
  const buildOptionKey = getGradleBuildOptionKey(majorVersion)
  const isEnabled = preset.options?.[buildOptionKey]
  return isEnabled === true || isEnabled === 'true'
}

// Sets the Gradle build option in export_presets.cfg
// If the file does not exist, it will be created
export async function setGradleBuildEnabled(value: boolean): Promise<void> {
  const exportPresetsPath = getExportPresetsPath()
  let exportPresets: ExportPresetsFile = {presets: []}
  if (fs.existsSync(exportPresetsPath)) {
    exportPresets = await loadExportPresets(exportPresetsPath)
  } else {
    console.warn(`Export presets not found at ${exportPresetsPath} - creating new file`)
  }
  const godotVersion = getGodotVersion()
  const majorVersion = getMajorVersion(godotVersion) as GodotMajorVersion
  let androidPreset = findPreset(exportPresets, {platform: 'Android'})
  if (!androidPreset) {
    androidPreset = getBasePreset('Android', majorVersion)
    exportPresets.presets.push(androidPreset)
  }
  const buildOptionKey = getGradleBuildOptionKey(majorVersion)
  androidPreset.options = androidPreset.options || {}
  androidPreset.options[buildOptionKey] = value
  await saveExportPresets(exportPresetsPath, exportPresets)
}
