import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:apiKey:create', () => {
  it('runs game:ios:apiKey:create cmd', async () => {
    const {stdout} = await runCommand('game:ios:apiKey:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:apiKey:create --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:apiKey:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
