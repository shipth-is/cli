import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:apiKey:status', () => {
  it('runs game:ios:apiKey:status cmd', async () => {
    const {stdout} = await runCommand('game:ios:apiKey:status')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:apiKey:status --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:apiKey:status --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
