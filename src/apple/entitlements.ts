import {CapabilityType} from './expo.js'

export type EntitlementKeyToCapability = Record<
  string,
  {name: string; type: (typeof CapabilityType)[keyof typeof CapabilityType]}
>

/** Known entitlement keys in raw entitlements XML → CapabilityType and display name. */
export const ENTITLEMENT_KEY_TO_CAPABILITY: EntitlementKeyToCapability = {
  'com.apple.developer.applesignin': {name: 'Sign in with Apple', type: CapabilityType.APPLE_ID_AUTH},
  'com.apple.developer.game-center': {name: 'Game Center', type: CapabilityType.GAME_CENTER},
  'com.apple.developer.healthkit': {name: 'HealthKit', type: CapabilityType.HEALTH_KIT},
  'com.apple.developer.healthkit.recalibrate-estimates': {
    name: 'HealthKit Recalibrate Estimates',
    type: CapabilityType.HEALTH_KIT_RECALIBRATE_ESTIMATES,
  },
  'com.apple.developer.homekit': {name: 'HomeKit', type: CapabilityType.HOME_KIT},
  'com.apple.developer.associated-domains': {
    name: 'Associated Domains',
    type: CapabilityType.ASSOCIATED_DOMAINS,
  },
  'com.apple.developer.authentication-services.autofill-credential-provider': {
    name: 'AutoFill Credential Provider',
    type: CapabilityType.AUTO_FILL_CREDENTIAL,
  },
  'com.apple.developer.ClassKit-environment': {name: 'ClassKit', type: CapabilityType.CLASS_KIT},
  'com.apple.developer.family-controls': {
    name: 'Family Controls',
    type: CapabilityType.FAMILY_CONTROLS,
  },
  'com.apple.developer.group-session': {
    name: 'Group Activities',
    type: CapabilityType.GROUP_ACTIVITIES,
  },
  'com.apple.developer.fileprovider.testing-mode': {
    name: 'File Provider Testing Mode',
    type: CapabilityType.FILE_PROVIDER_TESTING_MODE,
  },
  'com.apple.developer.networking.networkextension': {
    name: 'Network Extensions',
    type: CapabilityType.NETWORK_EXTENSIONS,
  },
  'com.apple.developer.networking.vpn.api': {
    name: 'Personal VPN',
    type: CapabilityType.PERSONAL_VPN,
  },
  'com.apple.developer.in-app-payments': {name: 'Apple Pay', type: CapabilityType.APPLE_PAY},
  'com.apple.developer.kernel.extended-virtual-addressing': {
    name: 'Extended Virtual Addressing',
    type: CapabilityType.EXTENDED_VIRTUAL_ADDRESSING,
  },
  'com.apple.developer.journal.allow': {
    name: 'Journaling Suggestions',
    type: CapabilityType.JOURNALING_SUGGESTIONS,
  },
  'com.apple.developer.managed-app-distribution.install-ui': {
    name: 'Managed App Installation UI',
    type: CapabilityType.MANAGED_APP_INSTALLATION_UI,
  },
  'com.apple.developer.media-device-discovery-extension': {
    name: 'Media Device Discovery',
    type: CapabilityType.MEDIA_DEVICE_DISCOVERY,
  },
  'com.apple.developer.matter.allow-setup-payload': {
    name: 'Matter Allow Setup Payload',
    type: CapabilityType.MATTER_ALLOW_SETUP_PAYLOAD,
  },
  'com.apple.developer.sustained-execution': {
    name: 'Sustained Execution',
    type: CapabilityType.SUSTAINED_EXECUTION,
  },
  'com.apple.security.application-groups': {name: 'App Groups', type: CapabilityType.APP_GROUP},
}

const KEY_ELEMENT_REGEX = /<key>\s*([^<]+?)\s*<\/key>/g

/** Parse raw entitlements XML string for known keys; return their CapabilityTypes (no duplicates). Matches exact <key>…</key> elements to avoid substring false positives (e.g. healthkit vs healthkit.recalibrate-estimates). */
export function parseEntitlementsAdditional(
  raw: string,
): (typeof CapabilityType)[keyof typeof CapabilityType][] {
  const types: (typeof CapabilityType)[keyof typeof CapabilityType][] = []
  if (!raw || typeof raw !== 'string') return types
  let match: RegExpExecArray | null
  KEY_ELEMENT_REGEX.lastIndex = 0
  while ((match = KEY_ELEMENT_REGEX.exec(raw)) !== null) {
    const key = match[1].trim()
    const entry = ENTITLEMENT_KEY_TO_CAPABILITY[key]
    if (entry && !types.includes(entry.type)) types.push(entry.type)
  }
  return types
}
