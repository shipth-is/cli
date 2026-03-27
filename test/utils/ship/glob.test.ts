import {expect} from 'chai'

import {
  DEFAULT_PLATFORM_GLOBS,
  LEGACY_DEFAULT_IGNORED_FILES_GLOBS,
  LEGACY_DEFAULT_SHIPPED_FILES_GLOBS,
} from '../../../src/constants/config.js'
import {Platform} from '../../../src/types/index.js'
import {resolveShipGlobConfig} from '../../../src/utils/ship/glob.js'

const LEGACY_DEFAULTS_WARNING_MESSAGE =
  'Using legacy default globs - you should upgrade to the new globs. Learn more: https://shipth.is/docs/guides/controlling-uploaded-files'
const LEGACY_UPGRADE_WARNING_MESSAGE =
  'Using legacy file selection globs - you should upgrade to the new globs. Learn more: https://shipth.is/docs/guides/controlling-uploaded-files'
const MISSING_GLOBS_WARNING_MESSAGE =
  'No file globs configured in shipthis.json; using defaults. Learn more: https://shipth.is/docs/guides/controlling-uploaded-files'

describe('resolveShipGlobConfig (ship/glob)', () => {
  it('switches to new mode + warns when legacy globs match historical defaults', () => {
    const legacyHistoricalIgnored = ['.git', '.gitignore', 'shipthis.json', 'shipthis-*.zip']

    const projectConfig = {
      shippedFilesGlobs: LEGACY_DEFAULT_SHIPPED_FILES_GLOBS,
      ignoredFilesGlobs: legacyHistoricalIgnored,
    }

    const resolved = resolveShipGlobConfig(projectConfig, [Platform.IOS])

    expect(resolved.mode).to.equal('new')
    expect(resolved.warningMessage).to.equal(LEGACY_DEFAULTS_WARNING_MESSAGE)
    // iOS-only new defaults should exclude android folder
    expect(resolved.ignore).to.include('android/**')
  })

  it('keeps legacy mode and warns when legacy globs are customized, even if `globs` is present', () => {
    const projectConfig = {
      shippedFilesGlobs: ['**/*.ts'],
      ignoredFilesGlobs: ['some/legacy-ignore/**'],
      globs: {
        base: {exclude: []},
        ios: {exclude: ['android/**']},
      },
    }

    const resolved = resolveShipGlobConfig(projectConfig, [Platform.IOS])

    expect(resolved.mode).to.equal('legacy')
    expect(resolved.warningMessage).to.equal(LEGACY_UPGRADE_WARNING_MESSAGE)
    expect(resolved.patterns).to.deep.equal(['**/*.ts'])
    expect(resolved.ignore).to.deep.equal(['some/legacy-ignore/**'])
  })

  it('in new mode, applies platform cross-excludes only when shipping exactly one platform', () => {
    const projectConfig = {
      shippedFilesGlobs: LEGACY_DEFAULT_SHIPPED_FILES_GLOBS,
      ignoredFilesGlobs: LEGACY_DEFAULT_IGNORED_FILES_GLOBS,
      globs: {
        base: {exclude: []},
        ios: {exclude: ['android/**']},
        android: {exclude: ['ios/**']},
      },
    }

    const resolved = resolveShipGlobConfig(projectConfig, [Platform.IOS, Platform.ANDROID])

    expect(resolved.mode).to.equal('new')
    expect(resolved.warningMessage).to.equal(LEGACY_DEFAULTS_WARNING_MESSAGE)
    expect(resolved.ignore).to.deep.equal([])
  })

  it('does not warn when using new globs', () => {
    const projectConfig = {
      globs: DEFAULT_PLATFORM_GLOBS,
    }

    const resolved = resolveShipGlobConfig(projectConfig, [Platform.IOS, Platform.ANDROID])

    expect(resolved.warningMessage).to.equal(undefined)
    expect(resolved.mode).to.equal('new')
    expect(resolved.ignore).to.deep.equal(DEFAULT_PLATFORM_GLOBS.base.exclude)
  });  

  it('warns when no globs or legacy fields are provided', () => {
    const projectConfig = {}

    const resolved = resolveShipGlobConfig(projectConfig, [Platform.IOS])

    expect(resolved.mode).to.equal('new')
    expect(resolved.warningMessage).to.equal(MISSING_GLOBS_WARNING_MESSAGE)
    expect(resolved.patterns).to.deep.equal(DEFAULT_PLATFORM_GLOBS.base.include)
    expect(resolved.ignore).to.include.members(DEFAULT_PLATFORM_GLOBS.base.exclude)
    expect(resolved.ignore).to.include('android/**')
  })

})
