import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:tester:add', () => {
  it('runs game:android:tester:add cmd', async () => {
    const {stdout} = await runCommand('game:android:tester:add')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:tester:add --name oclif', async () => {
    const {stdout} = await runCommand('game:android:tester:add --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
