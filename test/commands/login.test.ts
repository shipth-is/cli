import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('login', () => {
  it('runs login cmd', async () => {
    const {stdout} = await runCommand('login')
    expect(stdout).to.contain('hello world')
  })

  it('runs login --name oclif', async () => {
    const {stdout} = await runCommand('login --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
