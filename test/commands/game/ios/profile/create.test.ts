import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:profile:create', () => {
  it('runs game:ios:profile:create cmd', async () => {
    const {stdout} = await runCommand('game:ios:profile:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:profile:create --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:profile:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
