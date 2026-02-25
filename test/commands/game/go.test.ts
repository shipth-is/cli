import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:go', () => {
  it('runs game:go cmd', async () => {
    const {stdout} = await runCommand('game:go')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:go --name oclif', async () => {
    const {stdout} = await runCommand('game:go --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
