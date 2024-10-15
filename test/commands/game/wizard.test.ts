import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:wizard', () => {
  it('runs game:wizard cmd', async () => {
    const {stdout} = await runCommand('game:wizard')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:wizard --name oclif', async () => {
    const {stdout} = await runCommand('game:wizard --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
