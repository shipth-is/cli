import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:list', () => {
  it('runs game:list cmd', async () => {
    const {stdout} = await runCommand('game:list')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:list --name oclif', async () => {
    const {stdout} = await runCommand('game:list --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
