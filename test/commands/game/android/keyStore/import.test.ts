import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe.skip('game:android:keyStore:import (unimplemented)', () => {
  it('runs game:android:keyStore:import cmd', async () => {
    const {stdout} = await runCommand('game:android:keyStore:import')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:keyStore:import --name oclif', async () => {
    const {stdout} = await runCommand('game:android:keyStore:import --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
