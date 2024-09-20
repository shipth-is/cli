import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('apple:apiKey:export', () => {
  it('runs apple:apiKey:export cmd', async () => {
    const {stdout} = await runCommand('apple:apiKey:export')
    expect(stdout).to.contain('hello world')
  })

  it('runs apple:apiKey:export --name oclif', async () => {
    const {stdout} = await runCommand('apple:apiKey:export --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
