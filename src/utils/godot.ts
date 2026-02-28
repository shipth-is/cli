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

import {ENTITLEMENT_KEY_TO_CAPABILITY, parseEntitlementsAdditional} from '../apple/entitlements.js'
import {CapabilityType} from '../apple/expo.js'
import {Platform} from '../types/index.js'

// Check if the current working directory is a Godot game
// TODO: allow for cwd override
export function isCWDGodotGame(): boolean {
  const cwd = process.cwd()
  const godotProject = path.join(cwd, 'project.godot')
  return fs.existsSync(godotProject)
}

// Godot iOS export options (entitlements & capabilities):
// See EditorExportPlatformAppleEmbedded::get_export_options and
// $entitlements_full / $required_device_capabilities in:
// https://github.com/godotengine/godot/blob/master/editor/export/editor_export_platform_apple_embedded.cpp
// We support both entitlements/push_notifications (enum, Godot 4.6+) and legacy capabilities/push_notifications (bool).

export interface GodotSyncableCapability {
  key: string
  name: string
  type: (typeof CapabilityType)[keyof typeof CapabilityType]
  /** If true, enabled by entitlements/push_notifications or legacy capabilities/push_notifications */
  pushKey?: boolean
}

/** Syncable capabilities with a fixed preset key (bool or enum). Push is handled specially. */
export const GODOT_SYNCABLE_CAPABILITIES: GodotSyncableCapability[] = [
  {key: 'capabilities/access_wifi', name: 'Access WiFi', type: CapabilityType.ACCESS_WIFI},
  {key: 'entitlements/increased_memory_limit', name: 'Increased Memory Limit', type: CapabilityType.INCREASED_MEMORY_LIMIT},
  {key: 'entitlements/game_center', name: 'Game Center', type: CapabilityType.GAME_CENTER},
  {key: 'entitlements/push_notifications', name: 'Push Notifications', type: CapabilityType.PUSH_NOTIFICATIONS, pushKey: true},
]

/** All syncable capability entries for the Bundle ID table (fixed + from entitlements/additional). */
export const GODOT_CAPABILITIES: GodotSyncableCapability[] = [
  ...GODOT_SYNCABLE_CAPABILITIES,
  ...Object.entries(ENTITLEMENT_KEY_TO_CAPABILITY).map(([key, {name, type}]) => ({
    key: `entitlements/additional (${key})`,
    name,
    type,
  })),
]

function isPushEnabled(options: Record<string, unknown>): boolean {
  const entitlementsPush = options['entitlements/push_notifications']
  if (entitlementsPush != null) {
    const s = `${entitlementsPush}`.trim().toLowerCase()
    if (s === 'production' || s === 'development') return true
    if (s === 'disabled') return false
  }
  const legacyPush = options['capabilities/push_notifications']
  if (legacyPush != null) {
    return `${legacyPush}`.toLowerCase() === 'true'
  }
  return false
}

/** Optional override for testing; when set, skip getGodotExportPresets and use these options. */
export interface GetGodotProjectCapabilitiesOverrides {
  options?: Record<string, unknown>
}

// Tells us which capabilities are enabled in the Godot project (for syncing to Apple Bundle ID).
export async function getGodotProjectCapabilities(
  platform: Platform,
  overrides?: GetGodotProjectCapabilitiesOverrides,
) {
  const options: Record<string, unknown> =
    overrides?.options ?? (await getGodotExportPresets(platform)).options ?? {}
  const capabilities: (typeof CapabilityType)[keyof typeof CapabilityType][] = []

  for (const capability of GODOT_SYNCABLE_CAPABILITIES) {
    if (capability.pushKey) {
      if (isPushEnabled(options)) capabilities.push(capability.type)
      continue
    }
    if (!(capability.key in options)) continue
    if (`${options[capability.key]}`.toLowerCase() === 'true') capabilities.push(capability.type)
  }

  const additionalRaw = options['entitlements/additional']
  const fromAdditional = parseEntitlementsAdditional(
    typeof additionalRaw === 'string' ? additionalRaw : '',
  )
  for (const type of fromAdditional) {
    if (!capabilities.includes(type)) capabilities.push(type)
  }

  return capabilities
}

/** Display-only: options that go to plist/device capabilities; we do not sync these. */
export async function getGodotProjectDisplayOnlyCapabilities(platform: Platform): Promise<{
  performanceGamingTier: boolean
  performanceA12: boolean
  capabilitiesAdditional: string[]
}> {
  const exportPresets = await getGodotExportPresets(platform)
  const options: Record<string, unknown> = exportPresets.options ?? {}
  const arr = options['capabilities/additional']
  return {
    performanceGamingTier: `${options['capabilities/performance_gaming_tier']}`.toLowerCase() === 'true',
    performanceA12: `${options['capabilities/performance_a12']}`.toLowerCase() === 'true',
    capabilitiesAdditional: Array.isArray(arr) ? arr.map((x) => `${x}`) : [],
  }
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

export function getExportFormatOptionKey(majorVersion: GodotMajorVersion): string {
  return majorVersion === 4 ? 'gradle_build/export_format' : 'custom_build/export_format'
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
  // If we are setting to false (legacy build), also change the export format to APK
  const exportFormatOptionKey = getExportFormatOptionKey(majorVersion)
  if (value === false) {
    androidPreset.options[exportFormatOptionKey] = 0; // APK
  }
  await saveExportPresets(exportPresetsPath, exportPresets)
}
