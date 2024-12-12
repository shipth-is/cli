import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:apiKey:import', () => {
  it('runs game:android:apiKey:import cmd', async () => {
    const {stdout} = await runCommand('game:android:apiKey:import')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:apiKey:import --name oclif', async () => {
    const {stdout} = await runCommand('game:android:apiKey:import --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
