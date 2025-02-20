import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:ios:wizard', () => {
  it('runs game:ios:wizard cmd', async () => {
    const {stdout} = await runCommand('game:ios:wizard')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:wizard --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:wizard --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
