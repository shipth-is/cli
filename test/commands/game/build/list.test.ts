import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:build:list (unimplemented)', () => {
  it('runs game:build:list cmd', async () => {
    const {stdout} = await runCommand('game:build:list')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:build:list --name oclif', async () => {
    const {stdout} = await runCommand('game:build:list --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
