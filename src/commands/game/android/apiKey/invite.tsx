import {Args, Flags} from '@oclif/core'

import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {
  fetchKeyTestResult,
  KeyTestError,
  KeyTestStatus,
  niceError,
} from '@cli/utils/query/useAndroidServiceAccountTestResult.js'
import {inviteServiceAccount} from '@cli/api/index.js'
import {getInput} from '@cli/utils/index.js'

export default class GameAndroidApiKeyInvite extends BaseGameAndroidCommand<typeof GameAndroidApiKeyInvite> {
  static override args = {
    accountId: Args.string({description: 'The Google Play Account ID', required: false}),
  }

  static override description = 'Invites the Service Account to your Google Play Account.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    ...BaseGameAndroidCommand.flags,
    prompt: Flags.boolean({char: 'p', description: 'Prompt for the Google Play Account ID'}),
    waitForGoogleApp: Flags.boolean({char: 'p', description: 'Waits for the Google Play app to be created (10 mins).'}),
    waitForAuth: Flags.boolean({char: 'w', description: 'Wait for Google Authentication (10 mins).'}),
  }

  public async run(): Promise<void> {
    const game = await this.getGame()
    const {prompt, waitForAuth, waitForGoogleApp} = this.flags

    this.checkGoogleAuth(waitForAuth)

    const getAccountId = async () => {
      if (!prompt) return this.args.accountId
      const entered = await getInput(`Please enter the Google Play Account ID: `)
      return entered
    }

    const waitForApp = async () => {
      console.log('Waiting for Google Play app to be created...')
      const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
      let testResult = await fetchKeyTestResult({projectId: game.id})
      while (testResult.error === KeyTestError.APP_NOT_FOUND) {
        process.stdout.write('.')
        await sleep(1000 * 30)
        testResult = await fetchKeyTestResult({projectId: game.id})
      }
      return testResult
    }

    const accountId = await getAccountId()
    if (!accountId) {
      this.error('You must provide a Google Play Account ID.', {exit: 1})
    }

    let testResult = await fetchKeyTestResult({projectId: game.id})

    if (testResult.status === KeyTestStatus.SUCCESS) {
      this.error('The Service Account API Key is working and does not need to be invited.', {
        exit: 1,
      })
    }

    if (testResult.error === KeyTestError.APP_NOT_FOUND && waitForGoogleApp) {
      this.log('Waiting for Google Play app to be created...')
      // TODO
      testResult = await waitForApp()
    }

    if (testResult.error !== KeyTestError.NOT_INVITED) {
      this.error(`${niceError(testResult.error)}`)
    }

    await inviteServiceAccount(game.id, accountId)

    await this.config.runCommand(`game:android:apiKey:status`, ['--gameId', game.id])
  }
}
