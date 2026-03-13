import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:android:status (unimplemented)', () => {
  it('runs game:android:status cmd', async () => {
    const {stdout} = await runCommand('game:android:status')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:status --name oclif', async () => {
    const {stdout} = await runCommand('game:android:status --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
