import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:keyStore:create', () => {
  it('runs game:android:keyStore:create cmd', async () => {
    const {stdout} = await runCommand('game:android:keyStore:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:keyStore:create --name oclif', async () => {
    const {stdout} = await runCommand('game:android:keyStore:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
