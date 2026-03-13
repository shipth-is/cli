import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:ios:apiKey:status (unimplemented)', () => {
  it('runs game:ios:apiKey:status cmd', async () => {
    const {stdout} = await runCommand('game:ios:apiKey:status')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:apiKey:status --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:apiKey:status --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
