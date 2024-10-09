import path from 'path'
import fs from 'fs'
import {parse} from 'ini'
import merge from 'deepmerge'

import {Platform} from '@cli/types.js'
import {CapabilityType} from '@cli/apple/expo.js'

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
  {name: 'Access WiFi', key: 'capabilities/access_wifi', type: CapabilityType.ACCESS_WIFI},
  {name: 'Push Notifications', key: 'capabilities/push_notifications', type: CapabilityType.PUSH_NOTIFICATIONS},
]

// Tells us which capabilities are enabled in the Godot project
export function getGodotProjectCapabilities(platform: Platform) {
  const exportPresets = getGodotExportPresets(platform)

  const options: {
    [key: string]: any
  } = exportPresets.options

  const capabilities = []

  for (const capability of GODOT_CAPABILITIES) {
    if (!(capability.key in options)) continue
    if (`${options[capability.key]}`.toLocaleLowerCase() == 'true') capabilities.push(capability.type)
  }

  return capabilities
}

export function getGodotProjectConfig() {
  const cwd = process.cwd()
  const projectGodotPath = path.join(cwd, 'project.godot')
  const projectGodotContent = fs.readFileSync(projectGodotPath, 'utf8')
  return parse(projectGodotContent)
}

export function getGodotProjectName(): string | null {
  try {
    const projectGodotConfig = getGodotProjectConfig()
    return projectGodotConfig['application']['config/name']
  } catch (e) {
    return null
  }
}

export function getGodotAppleBundleIdentifier(): string | null {
  try {
    const preset = getGodotExportPresets(Platform.IOS)
    return (preset.options as any)['application/bundle_identifier']
  } catch (e) {
    console.log(e)
    return null
  }
}

// TODO: is there a more reliable way to get the Godot version?
export function getGodotVersion(): string {
  const projectGodotConfig = getGodotProjectConfig()
  if ('config/features' in projectGodotConfig['application']) {
    const features = projectGodotConfig['application']['config/features']
    // config/features=PackedStringArray("4.3")
    // config/features=PackedStringArray("4.2", "GL Compatibility")
    const match = features.match(/"(\d+\.\d+)"/)
    if (!match) throw new Error("Couldn't find Godot version in project.godot")
    return match[1]
  }
  return '3.X'
}

// TODO: any differences in the presets between v 3.X and 4.X?
export function getGodotExportPresets(platform: Platform) {
  const {warn} = console

  // Get the base config for this preset
  let presetConfig = platform === Platform.IOS ? getBaseExportPresets_iOS() : getBaseExportPresets_Android()

  // Get the preset options from any export_presets.cfg if found
  const cwd = process.cwd()
  const filename = 'export_presets.cfg'
  const exportPresetsPath = path.join(cwd, filename)

  const isFound = fs.existsSync(exportPresetsPath)
  if (!isFound) {
    warn(`${filename} not found at ${exportPresetsPath}`)
  } else {
    const exportPresetsContent = fs.readFileSync(exportPresetsPath, 'utf8')
    const exportPresetsIni = parse(exportPresetsContent)
    // Find the preset with the same name in the existing config
    const presetIndexes = Object.keys(exportPresetsIni.preset)
    const presetIndex = presetIndexes.find((index) => {
      const current = exportPresetsIni.preset[index]
      return `${current.name}`.toUpperCase() === platform
    })

    if (!presetIndex) {
      warn(`Preset ${platform} not found in ${filename} - will use defaults`)
    } else {
      // Merge the preset options base config
      presetConfig = merge(presetConfig, exportPresetsIni.preset[presetIndex]) as any
    }
  }

  return presetConfig
}

// TODO: type this properly (including missing options)
function getBaseExportPresets_iOS() {
  return {
    name: 'iOS',
    platform: 'iOS',
    runnable: true,
    dedicated_server: false,
    custom_features: '',
    export_filter: 'all_resources',
    include_filter: '',
    exclude_filter: '',
    export_path: 'output',
    encryption_include_filters: '',
    encryption_exclude_filters: '',
    encrypt_pck: false,
    encrypt_directory: false,
    options: {
      'custom_template/debug': '',
      'custom_template/release': '',
      'architectures/arm64': true,
      'application/signature': '',
      'application/icon_interpolation': '4',
      'application/launch_screens_interpolation': '4',
      'application/export_project_only': true,
      'capabilities/access_wifi': false,
      'capabilities/push_notifications': false,
      'user_data/accessible_from_files_app': false,
      'user_data/accessible_from_itunes_sharing': false,
      'privacy/camera_usage_description': '',
      'privacy/camera_usage_description_localized': '{}',
      'privacy/microphone_usage_description': '',
      'privacy/microphone_usage_description_localized': '{}',
      'privacy/photolibrary_usage_description': '',
      'privacy/photolibrary_usage_description_localized': '{}',
      'icons/iphone_120x120': '',
      'icons/iphone_180x180': '',
      'icons/ipad_76x76': '',
      'icons/ipad_152x152': '',
      'icons/ipad_167x167': '',
      'icons/app_store_1024x1024': '',
      'icons/spotlight_40x40': '',
      'icons/spotlight_80x80': '',
      'icons/settings_58x58': '',
      'icons/settings_87x87': '',
      'icons/notification_40x40': '',
      'icons/notification_60x60': '',
      'storyboard/use_launch_screen_storyboard': true,
      'storyboard/image_scale_mode': '0',
      'storyboard/custom_image@2x': '',
      'storyboard/custom_image@3x': '',
      'storyboard/use_custom_bg_color': false,
      'storyboard/custom_bg_color': 'Color(0, 0, 0, 1)',
      'landscape_launch_screens/iphone_2436x1125': '',
      'landscape_launch_screens/iphone_2208x1242': '',
      'landscape_launch_screens/ipad_1024x768': '',
      'landscape_launch_screens/ipad_2048x1536': '',
      'portrait_launch_screens/iphone_640x960': '',
      'portrait_launch_screens/iphone_640x1136': '',
      'portrait_launch_screens/iphone_750x1334': '',
      'portrait_launch_screens/iphone_1125x2436': '',
      'portrait_launch_screens/ipad_768x1024': '',
      'portrait_launch_screens/ipad_1536x2048': '',
      'portrait_launch_screens/iphone_1242x2208': '',
      'application/short_version': '1.0.0', // default version number
    },
  }
}
function getBaseExportPresets_Android() {
  return {
    name: 'Android',
    platform: 'Android',
    // TODO
    options: {
      // TODO
    },
  }
}
