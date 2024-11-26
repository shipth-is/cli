import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('internal:readme', () => {
  it('runs internal:readme cmd', async () => {
    const {stdout} = await runCommand('internal:readme')
    expect(stdout).to.contain('hello world')
  })

  it('runs internal:readme --name oclif', async () => {
    const {stdout} = await runCommand('internal:readme --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
