import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:app:create', () => {
  it('runs game:ios:app:create cmd', async () => {
    const {stdout} = await runCommand('game:ios:app:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:app:create --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:app:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
