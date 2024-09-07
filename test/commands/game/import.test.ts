import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:import', () => {
  it('runs game:import cmd', async () => {
    const {stdout} = await runCommand('game:import')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:import --name oclif', async () => {
    const {stdout} = await runCommand('game:import --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
