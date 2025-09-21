import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('apple:apiKey:delete', () => {
  it('runs apple:apiKey:delete cmd', async () => {
    const {stdout} = await runCommand('apple:apiKey:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs apple:apiKey:delete --name oclif', async () => {
    const {stdout} = await runCommand('apple:apiKey:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
