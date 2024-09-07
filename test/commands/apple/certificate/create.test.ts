import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('apple:certificate:create', () => {
  it('runs apple:certificate:create cmd', async () => {
    const {stdout} = await runCommand('apple:certificate:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs apple:certificate:create --name oclif', async () => {
    const {stdout} = await runCommand('apple:certificate:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
