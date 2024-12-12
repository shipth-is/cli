import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:setup', () => {
  it('runs game:android:setup cmd', async () => {
    const {stdout} = await runCommand('game:android:setup')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:setup --name oclif', async () => {
    const {stdout} = await runCommand('game:android:setup --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
