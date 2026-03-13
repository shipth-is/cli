import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:android:keyStore:export (unimplemented)', () => {
  it('runs game:android:keyStore:export cmd', async () => {
    const {stdout} = await runCommand('game:android:keyStore:export')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:keyStore:export --name oclif', async () => {
    const {stdout} = await runCommand('game:android:keyStore:export --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
