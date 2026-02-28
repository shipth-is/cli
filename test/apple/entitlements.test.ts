import {expect} from 'chai'

import {CapabilityType} from '../../src/apple/expo.js'
import {
  ENTITLEMENT_KEY_TO_CAPABILITY,
  parseEntitlementsAdditional,
} from '../../src/apple/entitlements.js'

describe('ENTITLEMENT_KEY_TO_CAPABILITY', () => {
  it('includes expected entitlement keys with correct CapabilityType', () => {
    expect(ENTITLEMENT_KEY_TO_CAPABILITY['com.apple.developer.applesignin']).to.deep.equal({
      name: 'Sign in with Apple',
      type: CapabilityType.APPLE_ID_AUTH,
    })
    expect(ENTITLEMENT_KEY_TO_CAPABILITY['com.apple.developer.healthkit']).to.deep.equal({
      name: 'HealthKit',
      type: CapabilityType.HEALTH_KIT,
    })
    expect(ENTITLEMENT_KEY_TO_CAPABILITY['com.apple.security.application-groups']).to.deep.equal({
      name: 'App Groups',
      type: CapabilityType.APP_GROUP,
    })
  })

  it('has entries for all commonly used entitlement keys', () => {
    const expectedKeys = [
      'com.apple.developer.applesignin',
      'com.apple.developer.game-center',
      'com.apple.developer.healthkit',
      'com.apple.developer.homekit',
      'com.apple.developer.associated-domains',
      'com.apple.security.application-groups',
    ]
    for (const key of expectedKeys) {
      expect(ENTITLEMENT_KEY_TO_CAPABILITY[key], `missing key: ${key}`).to.be.ok
      expect(ENTITLEMENT_KEY_TO_CAPABILITY[key].name).to.be.a('string')
      expect(ENTITLEMENT_KEY_TO_CAPABILITY[key].type).to.be.a('string')
    }
  })
})

describe('parseEntitlementsAdditional', () => {
  it('returns empty array for empty string', () => {
    expect(parseEntitlementsAdditional('')).to.deep.equal([])
  })

  it('returns matching CapabilityTypes for known keys in raw XML', () => {
    const raw = '<key>com.apple.developer.applesignin</key><array><string>Default</string></array>'
    expect(parseEntitlementsAdditional(raw)).to.include(CapabilityType.APPLE_ID_AUTH)
  })

  it('returns multiple types when multiple known keys present', () => {
    const raw =
      '<key>com.apple.developer.healthkit</key><true/><key>com.apple.developer.homekit</key><true/>'
    const result = parseEntitlementsAdditional(raw)
    expect(result).to.include(CapabilityType.HEALTH_KIT)
    expect(result).to.include(CapabilityType.HOME_KIT)
    expect(result).to.have.lengthOf(2)
  })

  it('returns no duplicates when same key appears multiple times', () => {
    const raw =
      '<key>com.apple.developer.healthkit</key><true/><key>com.apple.developer.healthkit</key>'
    const result = parseEntitlementsAdditional(raw)
    expect(result.filter((c) => c === CapabilityType.HEALTH_KIT)).to.have.lengthOf(1)
  })

  it('ignores unknown keys', () => {
    expect(parseEntitlementsAdditional('<key>com.example.unknown</key><true/>')).to.deep.equal([])
  })

  it('matches exact key elements only (no substring: healthkit.recalibrate-estimates does not match healthkit)', () => {
    const raw = '<key>com.apple.developer.healthkit.recalibrate-estimates</key><true/>'
    const result = parseEntitlementsAdditional(raw)
    expect(result).to.deep.equal([CapabilityType.HEALTH_KIT_RECALIBRATE_ESTIMATES])
    expect(result).not.to.include(CapabilityType.HEALTH_KIT)
  })
})
