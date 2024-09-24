import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:buildNumber', () => {
  it('runs game:buildNumber cmd', async () => {
    const {stdout} = await runCommand('game:buildNumber')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:buildNumber --name oclif', async () => {
    const {stdout} = await runCommand('game:buildNumber --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
