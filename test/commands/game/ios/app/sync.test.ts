import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:app:sync', () => {
  it('runs game:ios:app:sync cmd', async () => {
    const {stdout} = await runCommand('game:ios:app:sync')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:app:sync --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:app:sync --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
