import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:apiKey:invite', () => {
  it('runs game:android:apiKey:invite cmd', async () => {
    const {stdout} = await runCommand('game:android:apiKey:invite')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:apiKey:invite --name oclif', async () => {
    const {stdout} = await runCommand('game:android:apiKey:invite --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
