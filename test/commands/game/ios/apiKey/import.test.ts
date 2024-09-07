import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:apiKey:import', () => {
  it('runs game:ios:apiKey:import cmd', async () => {
    const {stdout} = await runCommand('game:ios:apiKey:import')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:apiKey:import --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:apiKey:import --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
