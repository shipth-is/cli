import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:job:status (unimplemented)', () => {
  it('runs game:job:status cmd', async () => {
    const {stdout} = await runCommand('game:job:status')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:job:status --name oclif', async () => {
    const {stdout} = await runCommand('game:job:status --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
