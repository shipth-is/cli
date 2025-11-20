import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('internal:glass', () => {
  it('runs internal:glass cmd', async () => {
    const {stdout} = await runCommand('internal:glass')
    expect(stdout).to.contain('hello world')
  })

  it('runs internal:glass --name oclif', async () => {
    const {stdout} = await runCommand('internal:glass --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
