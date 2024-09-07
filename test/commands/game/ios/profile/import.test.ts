import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:profile:import', () => {
  it('runs game:ios:profile:import cmd', async () => {
    const {stdout} = await runCommand('game:ios:profile:import')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:profile:import --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:profile:import --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
