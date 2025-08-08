import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('game:android:apiKey:policy', () => {
  it('runs game:android:apiKey:policy cmd', async () => {
    const {stdout} = await runCommand('game:android:apiKey:policy')
    expect(stdout).to.contain('hello world')
  })

  it('runs game:android:apiKey:policy --name oclif', async () => {
    const {stdout} = await runCommand('game:android:apiKey:policy --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
