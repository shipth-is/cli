import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:android:keyStore:status (unimplemented)', () => {
  it('runs game:android:keyStore:status cmd', async () => {
    const {stdout} = await runCommand('game:android:keyStore:status')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:keyStore:status --name oclif', async () => {
    const {stdout} = await runCommand('game:android:keyStore:status --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
