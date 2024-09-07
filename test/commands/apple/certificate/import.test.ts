import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('apple:certificate:import', () => {
  it('runs apple:certificate:import cmd', async () => {
    const {stdout} = await runCommand('apple:certificate:import')
    expect(stdout).to.contain('hello world')
  })

  it('runs apple:certificate:import --name oclif', async () => {
    const {stdout} = await runCommand('apple:certificate:import --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
