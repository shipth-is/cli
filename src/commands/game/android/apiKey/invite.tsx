import {Args, Flags} from '@oclif/core'

import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {
  fetchKeyTestResult,
  KeyTestError,
  KeyTestStatus,
  niceError,
} from '@cli/utils/query/useAndroidServiceAccountTestResult.js'
import {getGoogleStatus, inviteServiceAccount} from '@cli/api/index.js'

export default class GameAndroidApiKeyInvite extends BaseGameAndroidCommand<typeof GameAndroidApiKeyInvite> {
  static override args = {
    accountId: Args.string({description: 'The Google Play Account ID', required: true}),
  }

  static override description = 'Invites the Service Account to your Google Play Account.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    force: Flags.boolean({char: 'f'}),
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async run(): Promise<void> {
    const {force} = this.flags
    const {accountId} = this.args
    const game = await this.getGame()

    const testResult = await fetchKeyTestResult({projectId: game.id})

    if (!force && testResult.status === KeyTestStatus.SUCCESS) {
      this.log('The Service Account API Key is working and does not need to be invited. Use --force to invite it.')
      return
    }

    if (!force && testResult.error !== KeyTestError.NOT_INVITED) {
      this.error(`${niceError(testResult.error)}`)
    }

    const {isAuthenticated} = await getGoogleStatus()
    if (!isAuthenticated) {
      this.error('You must connect to Google first. Run `shipthis game android apiKey connect`', {exit: 1})
    }

    await inviteServiceAccount(game.id, accountId)

    await this.config.runCommand(`game:android:apiKey:status`, ['--gameId', game.id])
  }
}
