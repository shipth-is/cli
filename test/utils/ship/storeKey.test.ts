import {expect} from 'chai'

import {Platform, ProjectPlatformProgress} from '@cli/types'
import {
  checkStoreKeys,
  getNoStoreKeyError,
  getNoStoreKeyWarning,
  getStoreKeyCheckFailedWarning,
} from '@cli/utils/ship/storeKey.js'

const PROJECT_ID = 'b8b2701f-6b77-4e5b-82e0-4518619fb5c4'
const BOTH = [Platform.ANDROID, Platform.IOS]

// A fake progress request: only the platforms in withKey have a store key
const fakeProgress =
  (withKey: Platform[], failing: Platform[] = []) =>
  async (_projectId: string, platform: Platform) => {
    if (failing.includes(platform)) throw new Error('Request failed')
    return {hasApiKeyForPlatform: withKey.includes(platform), platform} as ProjectPlatformProgress
  }

// Runs the check with a fake progress request, and keeps the warnings it shows
const run = async (platforms: Platform[], withKey: Platform[], options: {failing?: Platform[]; isDryRun?: boolean} = {}) => {
  const warnings: string[] = []
  const result = await checkStoreKeys(
    PROJECT_ID,
    platforms,
    Boolean(options.isDryRun),
    (message) => warnings.push(message),
    fakeProgress(withKey, options.failing),
  )
  return {result, warnings}
}

describe('checkStoreKeys (ship/storeKey)', () => {
  for (const platform of BOTH) {
    const other = BOTH.find((p) => p !== platform)!

    describe(platform, () => {
      it('ships when the platform has a store key', async () => {
        const {result, warnings} = await run([platform], [platform])

        expect(result).to.deep.equal([platform])
        expect(warnings).to.deep.equal([])
      })

      it('throws the error when the only platform has no store key', async () => {
        const error = (await run([platform], []).catch((error_) => error_)) as Error

        expect(error).to.be.instanceOf(Error)
        expect(error.message).to.equal(getNoStoreKeyError(platform))
      })

      it('ships the other platform and warns when this one has no store key', async () => {
        const {result, warnings} = await run(BOTH, [other])

        expect(result).to.deep.equal([other])
        expect(warnings).to.deep.equal([getNoStoreKeyWarning(platform)])
      })

      it('warns and keeps every platform on a dry run', async () => {
        const {result, warnings} = await run([platform], [], {isDryRun: true})

        expect(result).to.deep.equal([platform])
        expect(warnings).to.deep.equal([getNoStoreKeyError(platform)])
      })

      it('warns and ships when the check request fails', async () => {
        const {result, warnings} = await run([platform], [], {failing: [platform]})

        expect(result).to.deep.equal([platform])
        expect(warnings).to.deep.equal([getStoreKeyCheckFailedWarning(platform)])
      })
    })
  }

  it('names both platforms when neither has a store key', async () => {
    const error = (await run(BOTH, []).catch((error_) => error_)) as Error

    expect(error.message).to.contain('Google Play Service Account API Key')
    expect(error.message).to.contain('App Store Connect API Key')
  })

})

describe('store key messages (ship/storeKey)', () => {
  it('gives the Android setup and skipPublish commands', () => {
    const message = getNoStoreKeyError(Platform.ANDROID)

    expect(message).to.contain('cannot be uploaded to Google Play')
    expect(message).to.contain('  shipthis game wizard android')
    expect(message).to.contain('  shipthis game ship --platform android --skipPublish')
  })

  it('gives the iOS setup and skipPublish commands', () => {
    const message = getNoStoreKeyError(Platform.IOS)

    expect(message).to.contain('cannot be uploaded to App Store Connect')
    expect(message).to.contain('  shipthis apple apiKey create')
    expect(message).to.contain('  shipthis game ship --platform ios --skipPublish')
  })
})
