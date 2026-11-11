import {expect} from 'chai'

import {Platform, ProjectCredential} from '@cli/types'
import {getActiveCredentialPlatforms} from '@cli/utils/ship/utils.js'

// ALL is not in the Platform enum - the encryption key comes from the backend with it
const makeCredential = (platform: string, isActive = true) => ({isActive, platform}) as ProjectCredential

describe('getActiveCredentialPlatforms (ship/utils)', () => {
  it('leaves out the ALL platform', () => {
    const credentials = [makeCredential('ALL'), makeCredential(Platform.ANDROID)]

    expect(getActiveCredentialPlatforms(credentials)).to.deep.equal([Platform.ANDROID])
  })
})
