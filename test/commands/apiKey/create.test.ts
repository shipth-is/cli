import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('apiKey:create', () => {
  it('runs apiKey:create cmd', async () => {
    const {stdout} = await runCommand('apiKey:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs apiKey:create --name oclif', async () => {
    const {stdout} = await runCommand('apiKey:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
