import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:apiKey:delete', () => {
  it('runs game:android:apiKey:delete cmd', async () => {
    const {stdout} = await runCommand('game:android:apiKey:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:apiKey:delete --name oclif', async () => {
    const {stdout} = await runCommand('game:android:apiKey:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
