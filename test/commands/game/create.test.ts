import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:create', () => {
  it('runs game:create cmd', async () => {
    const {stdout} = await runCommand('game:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:create --name oclif', async () => {
    const {stdout} = await runCommand('game:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
