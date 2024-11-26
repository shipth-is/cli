import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('apple:fastlane', () => {
  it('runs apple:fastlane cmd', async () => {
    const {stdout} = await runCommand('apple:fastlane')
    expect(stdout).to.contain('hello world')
  })

  it('runs apple:fastlane --name oclif', async () => {
    const {stdout} = await runCommand('apple:fastlane --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
