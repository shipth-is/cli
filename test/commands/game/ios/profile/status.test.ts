import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:profile:status', () => {
  it('runs game:ios:profile:status cmd', async () => {
    const {stdout} = await runCommand('game:ios:profile:status')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:profile:status --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:profile:status --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
