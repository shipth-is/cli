import {expect} from 'chai'
import {DateTime} from 'luxon'

import {Build, BuildType, Platform} from '@cli/types'
import {getBuildSummary} from '@cli/utils/query/useBuilds.js'

const makeBuild = (platform: Platform, buildType: BuildType) =>
  ({
    buildType,
    createdAt: DateTime.now(),
    id: 'e69a082b-4e33-4676-bd53-b8cfc28e2d7d',
    jobDetails: {},
    jobId: '21702a3b-1111-2222-3333-444455556666',
    platform,
  }) as unknown as Build

describe('getBuildSummary (query/useBuilds)', () => {
  it('downloads an APP build as game.app.zip', () => {
    const summary = getBuildSummary(makeBuild(Platform.IOS, BuildType.APP))
    expect(summary.cmd).to.equal('shipthis game build download e69a082b game.app.zip')
    expect(summary.platform).to.equal('iOS Simulator')
  })

  it('keeps the build type as the extension for other builds', () => {
    expect(getBuildSummary(makeBuild(Platform.IOS, BuildType.IPA)).cmd).to.match(/ game\.ipa$/)
    expect(getBuildSummary(makeBuild(Platform.ANDROID, BuildType.AAB)).cmd).to.match(/ game\.aab$/)
  })
})
