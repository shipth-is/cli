import {expect} from 'chai'

import {isInitialAndroidBuild, isRunningInitialAndroidJob} from '@cli/components/android/AndroidWizard/utils.js'
import {Build, BuildType, Job, JobStatus, Platform} from '@cli/types/index.js'

const build = (overrides: Partial<Build>, useDemoCredentials = false) =>
  ({buildType: BuildType.AAB, jobDetails: {useDemoCredentials}, platform: Platform.ANDROID, ...overrides}) as Build

describe('isInitialAndroidBuild (android wizard)', () => {
  it('accepts an Android AAB', () => {
    expect(isInitialAndroidBuild(build({}))).to.equal(true)
  })

  it('rejects a demo Android AAB', () => {
    expect(isInitialAndroidBuild(build({}, true))).to.equal(false)
  })

  it('rejects an Android APK', () => {
    expect(isInitialAndroidBuild(build({buildType: BuildType.APK}))).to.equal(false)
  })
})

describe('isRunningInitialAndroidJob (android wizard)', () => {
  it('rejects a running demo Android job', () => {
    const job = {details: {useDemoCredentials: true}, status: JobStatus.PROCESSING, type: Platform.ANDROID} as Job
    expect(isRunningInitialAndroidJob(job)).to.equal(false)
  })
})
