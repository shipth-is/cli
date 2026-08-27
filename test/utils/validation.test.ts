import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {expect} from 'chai'

import {SUPPORTED_GODOT_VERSIONS} from '../../src/constants/godot.js'
import {detectGodotVersion} from '../../src/utils/godot.js'
import {
  getDetailsWarnings,
  isSupportedGodotVersion,
  isVersionList,
  isValidAndroidPackageName,
  isValidIosBundleId,
  isValidStoreVersion,
  MAX_BUILD_NUMBER,
  validateDetailsValues,
} from '../../src/utils/validation.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('isSupportedGodotVersion', () => {
  const accepted = ['3.6', '4.0', '4.2', '4.2.1', '4.7', ' 4.2 ']
  const rejected = ['4', '4.9', '3.5', 'v4.2', '4.2-stable', '4.2.stable', '', 'godot']

  for (const version of accepted) {
    it(`accepts "${version}"`, () => {
      expect(isSupportedGodotVersion(version)).to.equal(true)
    })
  }

  for (const version of rejected) {
    it(`rejects "${version}"`, () => {
      expect(isSupportedGodotVersion(version)).to.equal(false)
    })
  }

  it('accepts every version in the supported list', () => {
    for (const version of SUPPORTED_GODOT_VERSIONS) {
      expect(isSupportedGodotVersion(version), version).to.equal(true)
    }
  })
})

// Binds the validator to detection. A fixture the CLI reads must pass the check that
// game create runs against it, or a real project warns for no reason.
describe('isSupportedGodotVersion (against the fixtures)', () => {
  const originalCwd = process.cwd()

  afterEach(() => {
    process.chdir(originalCwd)
  })

  for (const fixture of ['v3_5', 'v4_2']) {
    it(`accepts the version detected in ${fixture}`, () => {
      process.chdir(path.resolve(__dirname, '../fixtures/godot', fixture))
      const detected = detectGodotVersion()
      expect(detected).to.be.a('string')
      expect(isSupportedGodotVersion(detected as string), `${detected}`).to.equal(true)
    })
  }
})

describe('isVersionList', () => {
  it('accepts a bare array of major.minor strings', () => {
    expect(isVersionList(['3.6', '4.7'])).to.equal(true)
  })

  const rejected: [string, unknown][] = [
    ['an empty array', []],
    ['a version with no minor', ['4']],
    ['numbers', [1, 2]],
    ['the object form', {versions: ['4.7']}],
    ['an HTML error page', '<!doctype html><html>4.2</html>'],
    ['null', null],
    ['undefined', undefined],
  ]

  for (const [what, data] of rejected) {
    it(`rejects ${what}`, () => {
      expect(isVersionList(data)).to.equal(false)
    })
  }
})

describe('isSupportedGodotVersion (with a list from the server)', () => {
  it('accepts a version the server lists but the built-in list does not hold', () => {
    expect(isSupportedGodotVersion('4.8')).to.equal(false)
    expect(isSupportedGodotVersion('4.8', ['4.7', '4.8'])).to.equal(true)
  })

  it('rejects a version the server dropped', () => {
    expect(isSupportedGodotVersion('3.6', ['4.7', '4.8'])).to.equal(false)
  })

  it('still checks the shape against a server list', () => {
    expect(isSupportedGodotVersion('4.8-stable', ['4.8'])).to.equal(false)
  })
})

describe('isValidStoreVersion', () => {
  const accepted = ['1.2.3', '0.0.1', '10.20.30']
  const rejected = ['1.2', '1', '1.2.3-beta', '1.2.3+001', '01.2.3', 'v1.2.3', '1.2.3.4', '']

  for (const version of accepted) {
    it(`accepts "${version}"`, () => {
      expect(isValidStoreVersion(version)).to.equal(true)
    })
  }

  for (const version of rejected) {
    it(`rejects "${version}"`, () => {
      expect(isValidStoreVersion(version)).to.equal(false)
    })
  }
})

describe('isValidAndroidPackageName', () => {
  // "com.new.game" holds a Java keyword. Google Play accepts it, so the CLI does too - the
  // build tools are what reject one, and their keyword list differs by language.
  const accepted = ['com.mystudio.mygame', 'com.my_studio.game2', 'a.b.c.d', 'com.new.game', 'is.shipth.game']

  const rejected = ['game', 'com.my-studio.game', '1com.mystudio', 'com..game', 'com.mystudio.', '']

  for (const name of accepted) {
    it(`accepts "${name}"`, () => {
      expect(isValidAndroidPackageName(name)).to.equal(true)
    })
  }

  for (const name of rejected) {
    it(`rejects "${name}"`, () => {
      expect(isValidAndroidPackageName(name)).to.equal(false)
    })
  }
})

describe('isValidIosBundleId', () => {
  const accepted = ['com.mystudio.mygame', 'com.mystudio.my-game', 'com.mystudio.game2']
  const rejected = ['game', 'com.mystudio_game', 'com.mystudio.', 'com..game', '']

  for (const id of accepted) {
    it(`accepts "${id}"`, () => {
      expect(isValidIosBundleId(id)).to.equal(true)
    })
  }

  for (const id of rejected) {
    it(`rejects "${id}"`, () => {
      expect(isValidIosBundleId(id)).to.equal(false)
    })
  }
})

describe('validateDetailsValues', () => {
  it('returns null when nothing is set', () => {
    expect(validateDetailsValues({})).to.equal(null)
  })

  it('returns null for a set of good values', () => {
    const error = validateDetailsValues({
      androidPackageName: 'com.mystudio.mygame',
      buildNumber: 5,
      gameEngine: 'godot',
      gameEngineVersion: '4.2',
      iosBundleId: 'com.mystudio.mygame',
      name: 'Space Invaders',
      semanticVersion: '1.2.3',
    })
    expect(error).to.equal(null)
  })

  it('ignores the fields it does not check', () => {
    const error = validateDetailsValues({
      gcpProjectId: 'anything at all',
      gcpServiceAccountId: 'anything at all',
      useDemoCredentials: 'true',
    } as never)
    expect(error).to.equal(null)
  })

  it('links the semantic version error to the versioning guide', () => {
    const error = validateDetailsValues({semanticVersion: '1.2'})
    expect(error?.ref).to.equal('https://shipth.is/docs/guides/versioning')
    expect(error?.suggestions).to.deep.equal(['--semanticVersion 1.2.0'])
  })

  it('names the App Store when the semantic version has a prerelease suffix', () => {
    const error = validateDetailsValues({semanticVersion: '1.2.3-beta'})
    expect(error?.message).to.contain('App Store')
    expect(error?.suggestions).to.deep.equal(['--semanticVersion 1.2.3'])
  })

  it('accepts a version from the list it is given', () => {
    expect(validateDetailsValues({gameEngineVersion: '4.8'}, ['4.7', '4.8'])).to.equal(null)
  })

  it('names the versions it was given, and suggests from them', () => {
    const error = validateDetailsValues({gameEngineVersion: 'v4.8'}, ['4.7', '4.8'])
    expect(error?.message).to.contain('4.7, 4.8')
    expect(error?.suggestions).to.deep.equal(['--gameEngineVersion 4.8'])
  })

  it('falls back to the built-in list when it is given none', () => {
    const error = validateDetailsValues({gameEngineVersion: '4.8'})
    expect(error?.message).to.contain(SUPPORTED_GODOT_VERSIONS.join(', '))
  })

  it('links the engine version error to the Godot versioning guide', () => {
    const error = validateDetailsValues({gameEngineVersion: '4.9'})
    expect(error?.ref).to.equal('https://shipth.is/docs/guides/godot-versioning')
    expect(error?.suggestions).to.equal(undefined)
  })

  it('suggests the plain version when the engine version carries a suffix', () => {
    const error = validateDetailsValues({gameEngineVersion: '4.2-stable'})
    expect(error?.suggestions).to.deep.equal(['--gameEngineVersion 4.2'])
  })

  it('suggests the plain version when the engine version carries a v prefix', () => {
    const error = validateDetailsValues({gameEngineVersion: 'v4.2'})
    expect(error?.suggestions).to.deep.equal(['--gameEngineVersion 4.2'])
  })

  it('rejects a build number below 1', () => {
    const error = validateDetailsValues({buildNumber: 0})
    expect(error?.ref).to.equal('https://shipth.is/docs/guides/versioning')
  })

  it('rejects a build number above the Google Play limit', () => {
    expect(validateDetailsValues({buildNumber: MAX_BUILD_NUMBER})).to.equal(null)
    expect(validateDetailsValues({buildNumber: MAX_BUILD_NUMBER + 1})).to.not.equal(null)
  })

  it('links a badly shaped Android package name to the application ID rules', () => {
    const error = validateDetailsValues({androidPackageName: 'game'})
    expect(error?.ref).to.equal('https://developer.android.com/build/configure-app-module#set-application-id')
  })

  it('accepts a package name that holds a Java keyword, which Google Play also accepts', () => {
    expect(validateDetailsValues({androidPackageName: 'com.new.game'})).to.equal(null)
  })

  it('names the underscore in an iOS bundle ID error', () => {
    const error = validateDetailsValues({iosBundleId: 'com.mystudio_game'})
    expect(error?.message).to.contain('underscore')
    expect(error?.ref).to.equal(
      'https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleidentifier',
    )
  })

  it('rejects an empty game name', () => {
    expect(validateDetailsValues({name: '   '})?.message).to.contain('cannot be empty')
  })

  it('rejects a game name over the length limit', () => {
    expect(validateDetailsValues({name: 'a'.repeat(65)})?.message).to.contain('limit is 64')
  })

  it('rejects a game engine that is not godot', () => {
    const error = validateDetailsValues({gameEngine: 'unity'})
    expect(error?.suggestions).to.deep.equal(['--gameEngine godot'])
  })

  it('reports the first field in the fixed order', () => {
    const error = validateDetailsValues({buildNumber: 0, semanticVersion: '1.2'})
    expect(error?.message).to.contain('semantic version')
  })
})

describe('validateDetailsValues (liquidGlassIconPath)', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shipthis-icon-'))
  const iconDir = path.join(tmpDir, 'AppIcon.icon')
  const iconFile = path.join(tmpDir, 'NotAFolder.icon')

  before(() => {
    fs.mkdirSync(iconDir)
    fs.writeFileSync(iconFile, '')
  })

  after(() => {
    fs.rmSync(tmpDir, {force: true, recursive: true})
  })

  it('accepts a .icon folder that exists', () => {
    expect(validateDetailsValues({liquidGlassIconPath: iconDir})).to.equal(null)
  })

  it('accepts an empty value, which clears the field', () => {
    expect(validateDetailsValues({liquidGlassIconPath: ''})).to.equal(null)
  })

  it('rejects a path that does not end with .icon', () => {
    const error = validateDetailsValues({liquidGlassIconPath: path.join(tmpDir, 'icon.png')})
    expect(error?.message).to.contain('.icon folder')
  })

  it('rejects a .icon path that is missing', () => {
    const error = validateDetailsValues({liquidGlassIconPath: path.join(tmpDir, 'Missing.icon')})
    expect(error?.message).to.contain('not found')
  })

  it('rejects a .icon path that is a file', () => {
    const error = validateDetailsValues({liquidGlassIconPath: iconFile})
    expect(error?.message).to.contain('is a file')
  })
})

describe('getDetailsWarnings', () => {
  it('warns about a com.example package name', () => {
    const [warning] = getDetailsWarnings({androidPackageName: 'com.example.game'})
    expect(warning).to.contain('com.example.')
  })

  it('says nothing about a package name a user owns', () => {
    expect(getDetailsWarnings({androidPackageName: 'com.mystudio.mygame'})).to.deep.equal([])
  })
})
