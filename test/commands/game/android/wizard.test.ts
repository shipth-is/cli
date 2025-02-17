import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:wizard', () => {
  it('runs game:android:wizard cmd', async () => {
    const {stdout} = await runCommand('game:android:wizard')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:wizard --name oclif', async () => {
    const {stdout} = await runCommand('game:android:wizard --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
