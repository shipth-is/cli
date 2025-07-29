import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('apiKey:list', () => {
  it('runs apiKey:list cmd', async () => {
    const {stdout} = await runCommand('apiKey:list')
    expect(stdout).to.contain('hello world')
  })

  it('runs apiKey:list --name oclif', async () => {
    const {stdout} = await runCommand('apiKey:list --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
