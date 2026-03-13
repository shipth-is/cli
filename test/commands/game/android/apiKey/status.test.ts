import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:android:apiKey:status (unimplemented)', () => {
  it('runs game:android:apiKey:status cmd', async () => {
    const {stdout} = await runCommand('game:android:apiKey:status')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:apiKey:status --name oclif', async () => {
    const {stdout} = await runCommand('game:android:apiKey:status --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
