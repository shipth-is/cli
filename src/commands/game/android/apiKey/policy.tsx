import {Flags} from '@oclif/core'

import {enforcePolicy, getGoogleStatus, revokePolicy} from '@cli/api/index.js'
import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {getRenderedMarkdown} from '@cli/components/index.js'

export default class GameAndroidApiKeyPolicy extends BaseGameAndroidCommand<typeof GameAndroidApiKeyPolicy> {
  static override args = {}

  static override description =
    'Gets and sets the iam.disableServiceAccountKeyCreation policy for your Google Organization'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --enforce',
    '<%= config.bin %> <%= command.id %> --revoke',
  ]

  static override flags = {
    ...BaseGameAndroidCommand.flags,
    enforce: Flags.boolean({
      char: 'e',
      description: 'Enforces the policy',
      exclusive: ['revoke'],
    }),
    revoke: Flags.boolean({
      char: 'r',
      description: 'Revokes the policy',
      exclusive: ['enforce'],
    }),
    waitForAuth: Flags.boolean({char: 'w', description: 'Wait for Google Authentication (10 mins).'}),
  }

  public async run(): Promise<void> {
    const {enforce, revoke, waitForAuth} = this.flags

    await this.checkGoogleAuth(waitForAuth)

    if (enforce) {
      console.log('Enforcing policy...')
      await enforcePolicy()
    } else if (revoke) {
      console.log('Revoking policy...')
      await revokePolicy()
    }

    const googleStatus = await getGoogleStatus()

    const msg = getRenderedMarkdown({
      filename: 'service-account-policy.md.ejs',
      templateVars: {
        needsPolicyChange: !!googleStatus.needsPolicyChange,
        orgCreatedAt: `${googleStatus.orgCreatedAt}`,
        orgName: `${googleStatus.orgName}`,
        orgResourceName: `${googleStatus.orgResourceName}`,
      },
    })

    console.log(msg)
  }
}
