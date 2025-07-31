import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('apiKey:revoke', () => {
  it('runs apiKey:revoke cmd', async () => {
    const {stdout} = await runCommand('apiKey:revoke')
    expect(stdout).to.contain('hello world')
  })

  it('runs apiKey:revoke --name oclif', async () => {
    const {stdout} = await runCommand('apiKey:revoke --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
