import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:app:status', () => {
  it('runs game:ios:app:status cmd', async () => {
    const {stdout} = await runCommand('game:ios:app:status')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:app:status --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:app:status --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
