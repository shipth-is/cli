import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:android:apiKey:invite (unimplemented)', () => {
  it('runs game:android:apiKey:invite cmd', async () => {
    const {stdout} = await runCommand('game:android:apiKey:invite')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:apiKey:invite --name oclif', async () => {
    const {stdout} = await runCommand('game:android:apiKey:invite --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
