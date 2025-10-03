import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:keyStore:delete', () => {
  it('runs game:android:keyStore:delete cmd', async () => {
    const {stdout} = await runCommand('game:android:keyStore:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:keyStore:delete --name oclif', async () => {
    const {stdout} = await runCommand('game:android:keyStore:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
