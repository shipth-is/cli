import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('dashboard', () => {
  it('runs dashboard cmd', async () => {
    const {stdout} = await runCommand('dashboard')
    expect(stdout).to.contain('hello world')
  })

  it('runs dashboard --name oclif', async () => {
    const {stdout} = await runCommand('dashboard --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
