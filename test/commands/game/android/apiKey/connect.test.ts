import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:apiKey:connect', () => {
  it('runs game:android:apiKey:connect cmd', async () => {
    const {stdout} = await runCommand('game:android:apiKey:connect')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:apiKey:connect --name oclif', async () => {
    const {stdout} = await runCommand('game:android:apiKey:connect --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
