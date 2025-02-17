import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:apiKey:create', () => {
  it('runs game:android:apiKey:create cmd', async () => {
    const {stdout} = await runCommand('game:android:apiKey:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:apiKey:create --name oclif', async () => {
    const {stdout} = await runCommand('game:android:apiKey:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
