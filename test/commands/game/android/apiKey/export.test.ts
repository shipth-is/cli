import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:apiKey:export', () => {
  it('runs game:android:apiKey:export cmd', async () => {
    const {stdout} = await runCommand('game:android:apiKey:export')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:apiKey:export --name oclif', async () => {
    const {stdout} = await runCommand('game:android:apiKey:export --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
