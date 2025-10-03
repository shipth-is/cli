import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:profile:delete', () => {
  it('runs game:ios:profile:delete cmd', async () => {
    const {stdout} = await runCommand('game:ios:profile:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:profile:delete --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:profile:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
