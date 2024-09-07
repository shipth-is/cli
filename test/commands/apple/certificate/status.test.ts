import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('apple:certificate:status', () => {
  it('runs apple:certificate:status cmd', async () => {
    const {stdout} = await runCommand('apple:certificate:status')
    expect(stdout).to.contain('hello world')
  })

  it('runs apple:certificate:status --name oclif', async () => {
    const {stdout} = await runCommand('apple:certificate:status --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
