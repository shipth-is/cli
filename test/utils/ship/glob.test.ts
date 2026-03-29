import {expect} from 'chai'

import {
  DEFAULT_PLATFORM_GLOBS,
  LEGACY_DEFAULT_IGNORED_FILES_GLOBS,
  LEGACY_DEFAULT_SHIPPED_FILES_GLOBS,
} from '../../../src/constants/config.js'
import {Platform} from '../../../src/types/index.js'
import {getFinalRuleset} from '../../../src/utils/ship/glob.js'

const LEGACY_DEFAULTS_WARNING_MESSAGE =
  'Using legacy default globs - you should upgrade to the new globs. Learn more: https://shipth.is/docs/guides/controlling-uploaded-files'
const LEGACY_UPGRADE_WARNING_MESSAGE =
  'Using legacy custom file selection globs - you should upgrade to the new globs. Learn more: https://shipth.is/docs/guides/controlling-uploaded-files'
const MISSING_GLOBS_WARNING_MESSAGE =
  'No file globs configured in shipthis.json; using defaults. Learn more: https://shipth.is/docs/guides/controlling-uploaded-files'

describe('getFinalRuleset (ship/glob)', () => {
  it('switches to new mode + warns when legacy globs match historical defaults', () => {
    const legacyHistoricalIgnored = ['.git', '.gitignore', 'shipthis.json', 'shipthis-*.zip']

    const projectConfig = {
      shippedFilesGlobs: LEGACY_DEFAULT_SHIPPED_FILES_GLOBS,
      ignoredFilesGlobs: legacyHistoricalIgnored,
    }

    const resolved = getFinalRuleset(projectConfig, [Platform.IOS])

    expect(resolved.warning).to.equal(LEGACY_DEFAULTS_WARNING_MESSAGE)
    // iOS-only new defaults should exclude android folder
    expect(resolved.exclude).to.include('android/**')
  })

  it('keeps legacy mode and warns when legacy globs are customized, even if `globs` is present', () => {
    const projectConfig = {
      shippedFilesGlobs: ['**/*.ts'],
      ignoredFilesGlobs: ['some/legacy-ignore/**'],
      globs: {
        android: {exclude: [], include: []},
        base: {exclude: [], include: ['**/*']},
        ios: {exclude: ['android/**'], include: []},
      },
    }

    const resolved = getFinalRuleset(projectConfig, [Platform.IOS])

    expect(resolved.warning).to.equal(LEGACY_UPGRADE_WARNING_MESSAGE)
    expect(resolved.include).to.deep.equal(['**/*.ts'])
    expect(resolved.exclude).to.deep.equal(['some/legacy-ignore/**'])
  })

  it('in new mode, applies platform cross-excludes only when shipping exactly one platform', () => {
    const projectConfig = {
      shippedFilesGlobs: LEGACY_DEFAULT_SHIPPED_FILES_GLOBS,
      ignoredFilesGlobs: LEGACY_DEFAULT_IGNORED_FILES_GLOBS,
      globs: {
        android: {exclude: ['ios/**'], include: []},
        base: {exclude: [], include: LEGACY_DEFAULT_SHIPPED_FILES_GLOBS},
        ios: {exclude: ['android/**'], include: []},
      },
    }

    const resolved = getFinalRuleset(projectConfig, [Platform.IOS, Platform.ANDROID])

    expect(resolved.warning).to.equal(LEGACY_DEFAULTS_WARNING_MESSAGE)
    expect(resolved.exclude).to.deep.equal([])
  })

  it('does not warn when using new globs', () => {
    const projectConfig = {
      globs: DEFAULT_PLATFORM_GLOBS,
    }

    const resolved = getFinalRuleset(projectConfig, [Platform.IOS, Platform.ANDROID])

    expect(resolved.warning).to.equal(undefined)
    expect(resolved.exclude).to.deep.equal(DEFAULT_PLATFORM_GLOBS.base.exclude)
  })

  it('warns when no globs or legacy fields are provided', () => {
    const projectConfig = {}

    const resolved = getFinalRuleset(projectConfig, [Platform.IOS])

    expect(resolved.warning).to.equal(MISSING_GLOBS_WARNING_MESSAGE)
    expect(resolved.include).to.deep.equal(DEFAULT_PLATFORM_GLOBS.base.include)
    expect(resolved.exclude).to.include.members(DEFAULT_PLATFORM_GLOBS.base.exclude)
    expect(resolved.exclude).to.include('android/**')
  })

  it('merges `base.include` with the active platform `include` when shipping a single platform', () => {
    const projectConfig = {
      globs: {
        android: {exclude: [], include: ['android/extra/**']},
        base: {exclude: [], include: ['**/*.res']},
        ios: {exclude: [], include: ['ios/extra/**']},
      },
    }

    const iosResolved = getFinalRuleset(projectConfig, [Platform.IOS])
    expect(iosResolved.include).to.deep.equal(['**/*.res', 'ios/extra/**'])

    const androidResolved = getFinalRuleset(projectConfig, [Platform.ANDROID])
    expect(androidResolved.include).to.deep.equal(['**/*.res', 'android/extra/**'])

    const bothResolved = getFinalRuleset(projectConfig, [Platform.IOS, Platform.ANDROID])
    expect(bothResolved.include).to.deep.equal(['**/*.res'])
  })
})
