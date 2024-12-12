import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:keyStore:export', () => {
  it('runs game:android:keyStore:export cmd', async () => {
    const {stdout} = await runCommand('game:android:keyStore:export')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:keyStore:export --name oclif', async () => {
    const {stdout} = await runCommand('game:android:keyStore:export --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
