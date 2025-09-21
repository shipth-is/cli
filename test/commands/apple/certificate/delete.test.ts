import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('apple:certificate:delete', () => {
  it('runs apple:certificate:delete cmd', async () => {
    const {stdout} = await runCommand('apple:certificate:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs apple:certificate:delete --name oclif', async () => {
    const {stdout} = await runCommand('apple:certificate:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
