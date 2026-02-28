import {expect} from 'chai'

import {parseEntitlementsAdditional} from '../../src/apple/entitlements.js'
import {CapabilityType} from '../../src/apple/expo.js'
import {Platform} from '../../src/types/index.js'
import {getGodotProjectCapabilities} from '../../src/utils/godot.js'

describe('getGodotProjectCapabilities', () => {
  it('returns PUSH_NOTIFICATIONS when entitlements/push_notifications is Production', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {'entitlements/push_notifications': 'Production'},
    })
    expect(caps).to.include(CapabilityType.PUSH_NOTIFICATIONS)
  })

  it('returns PUSH_NOTIFICATIONS when entitlements/push_notifications is Development', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {'entitlements/push_notifications': 'Development'},
    })
    expect(caps).to.include(CapabilityType.PUSH_NOTIFICATIONS)
  })

  it('does not include PUSH_NOTIFICATIONS when entitlements/push_notifications is Disabled', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {'entitlements/push_notifications': 'Disabled'},
    })
    expect(caps).not.to.include(CapabilityType.PUSH_NOTIFICATIONS)
  })

  it('returns PUSH_NOTIFICATIONS when legacy capabilities/push_notifications is true', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {'capabilities/push_notifications': true},
    })
    expect(caps).to.include(CapabilityType.PUSH_NOTIFICATIONS)
  })

  it('returns INCREASED_MEMORY_LIMIT and GAME_CENTER when enabled', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {
        'entitlements/increased_memory_limit': true,
        'entitlements/game_center': true,
      },
    })
    expect(caps).to.include(CapabilityType.INCREASED_MEMORY_LIMIT)
    expect(caps).to.include(CapabilityType.GAME_CENTER)
  })

  it('returns ACCESS_WIFI when capabilities/access_wifi is true', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {'capabilities/access_wifi': true},
    })
    expect(caps).to.include(CapabilityType.ACCESS_WIFI)
  })

  it('includes PUSH_NOTIFICATIONS only once when both push keys are set', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {
        'entitlements/push_notifications': 'Production',
        'capabilities/push_notifications': true,
      },
    })
    const pushCount = caps.filter((c) => c === CapabilityType.PUSH_NOTIFICATIONS).length
    expect(pushCount).to.equal(1)
  })

  it('includes APPLE_ID_AUTH when entitlements/additional contains com.apple.developer.applesignin', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {
        'entitlements/additional': `<key>com.apple.developer.applesignin</key>
<array>
    <string>Default</string>
</array>`,
      },
    })
    expect(caps).to.include(CapabilityType.APPLE_ID_AUTH)
  })

  it('includes HEALTH_KIT when entitlements/additional contains com.apple.developer.healthkit', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {
        'entitlements/additional': '<key>com.apple.developer.healthkit</key><true/>',
      },
    })
    expect(caps).to.include(CapabilityType.HEALTH_KIT)
  })

  it('includes HOME_KIT when entitlements/additional contains com.apple.developer.homekit', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {
        'entitlements/additional': '<key>com.apple.developer.homekit</key><true/>',
      },
    })
    expect(caps).to.include(CapabilityType.HOME_KIT)
  })

  it('includes APP_GROUP when entitlements/additional contains com.apple.security.application-groups', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {
        'entitlements/additional':
          '<key>com.apple.security.application-groups</key><array><string>group.com.example.app</string></array>',
      },
    })
    expect(caps).to.include(CapabilityType.APP_GROUP)
  })

  it('includes ASSOCIATED_DOMAINS when entitlements/additional contains com.apple.developer.associated-domains', async () => {
    const caps = await getGodotProjectCapabilities(Platform.IOS, {
      options: {
        'entitlements/additional':
          '<key>com.apple.developer.associated-domains</key><array><string>applinks:example.com</string></array>',
      },
    })
    expect(caps).to.include(CapabilityType.ASSOCIATED_DOMAINS)
  })
})

describe('parseEntitlementsAdditional', () => {
  it('returns APPLE_ID_AUTH for content containing com.apple.developer.applesignin', () => {
    const raw = '<key>com.apple.developer.applesignin</key><array><string>Default</string></array>'
    expect(parseEntitlementsAdditional(raw)).to.include(CapabilityType.APPLE_ID_AUTH)
  })

  it('returns HEALTH_KIT for content containing com.apple.developer.healthkit', () => {
    expect(parseEntitlementsAdditional('<key>com.apple.developer.healthkit</key><true/>')).to.include(
      CapabilityType.HEALTH_KIT,
    )
  })

  it('returns HOME_KIT for content containing com.apple.developer.homekit', () => {
    expect(parseEntitlementsAdditional('<key>com.apple.developer.homekit</key><true/>')).to.include(
      CapabilityType.HOME_KIT,
    )
  })

  it('returns APP_GROUP for content containing com.apple.security.application-groups', () => {
    expect(
      parseEntitlementsAdditional(
        '<key>com.apple.security.application-groups</key><array><string>group.foo</string></array>',
      ),
    ).to.include(CapabilityType.APP_GROUP)
  })

  it('returns all corresponding types with no duplicates when multiple known keys present', () => {
    const raw =
      '<key>com.apple.developer.applesignin</key><array/><key>com.apple.developer.healthkit</key><true/><key>com.apple.developer.applesignin</key>'
    const result = parseEntitlementsAdditional(raw)
    expect(result).to.include(CapabilityType.APPLE_ID_AUTH)
    expect(result).to.include(CapabilityType.HEALTH_KIT)
    expect(result.filter((c) => c === CapabilityType.APPLE_ID_AUTH).length).to.equal(1)
    expect(result.length).to.equal(2)
  })

  it('returns empty array for empty or non-string input', () => {
    expect(parseEntitlementsAdditional('')).to.deep.equal([])
    expect(parseEntitlementsAdditional(null as unknown as string)).to.deep.equal([])
  })

  it('returns empty array when no known keys present', () => {
    expect(parseEntitlementsAdditional('<key>com.example.other</key><true/>')).to.deep.equal([])
  })

  it('returns only known keys when mixed with unknown key', () => {
    const raw =
      '<key>com.example.unknown</key><true/><key>com.apple.developer.homekit</key><true/>'
    expect(parseEntitlementsAdditional(raw)).to.deep.equal([CapabilityType.HOME_KIT])
  })
})
