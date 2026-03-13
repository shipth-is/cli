import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:ship (unimplemented)', () => {
  it('runs game:ship cmd', async () => {
    const {stdout} = await runCommand('game:ship')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ship --name oclif', async () => {
    const {stdout} = await runCommand('game:ship --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
