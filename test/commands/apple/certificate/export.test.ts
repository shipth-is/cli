import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('apple:certificate:export', () => {
  it('runs apple:certificate:export cmd', async () => {
    const {stdout} = await runCommand('apple:certificate:export')
    expect(stdout).to.contain('hello world')
  })

  it('runs apple:certificate:export --name oclif', async () => {
    const {stdout} = await runCommand('apple:certificate:export --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
