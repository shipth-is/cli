import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('status (unimplemented)', () => {
  it('runs status cmd', async () => {
    const {stdout} = await runCommand('status')
    expect(stdout).to.contain('hello world')
  })

  it('runs status --name oclif', async () => {
    const {stdout} = await runCommand('status --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
