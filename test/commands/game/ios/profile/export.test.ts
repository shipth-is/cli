import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:profile:export', () => {
  it('runs game:ios:profile:export cmd', async () => {
    const {stdout} = await runCommand('game:ios:profile:export')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:profile:export --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:profile:export --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
