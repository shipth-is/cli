import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:export (unimplemented)', () => {
  it('runs game:export cmd', async () => {
    const {stdout} = await runCommand('game:export')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:export --name oclif', async () => {
    const {stdout} = await runCommand('game:export --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
