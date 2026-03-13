import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:ios:app:addTester (unimplemented)', () => {
  it('runs game:ios:app:addTester cmd', async () => {
    const {stdout} = await runCommand('game:ios:app:addTester')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:ios:app:addTester --name oclif', async () => {
    const {stdout} = await runCommand('game:ios:app:addTester --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
