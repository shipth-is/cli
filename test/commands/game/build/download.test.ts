import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:build:download', () => {
  it('runs game:build:download cmd', async () => {
    const {stdout} = await runCommand('game:build:download')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:build:download --name oclif', async () => {
    const {stdout} = await runCommand('game:build:download --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
