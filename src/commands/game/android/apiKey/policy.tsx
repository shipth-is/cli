import {Flags} from '@oclif/core'
import {render} from 'ink'

import {disconnectGoogle, getGoogleStatus} from '@cli/api/index.js'
import {BaseGameAndroidCommand} from '@cli/baseCommands/index.js'
import {CommandGame, ConnectGoogle, getRenderedMarkdown} from '@cli/components/index.js'

export default class GameAndroidApiKeyPolicy extends BaseGameAndroidCommand<typeof GameAndroidApiKeyPolicy> {
  static override args = {}

  static override description =
    'Gets and sets the constraints/iam.disableServiceAccountKeyCreation policy for your Google Organization'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --enforce',
    '<%= config.bin %> <%= command.id %> --revoke',
  ]

  static override flags = {
    ...BaseGameAndroidCommand.flags,
    enforce: Flags.boolean({char: 'e', description: 'Enforces the policy to disable service account key creation'}),
    revoke: Flags.boolean({char: 'r', description: 'Revokes the policy to disable service account key creation'}),
  }


  public async run(): Promise<void> {
    const googleStatus = await getGoogleStatus()

    const msg = getRenderedMarkdown({
      filename: 'service-account-policy.md',
      templateVars: {
        orgName: `${googleStatus.orgName}`,
        orgResourceName: `${googleStatus.orgResourceName}`,
        orgCreatedAt: `${googleStatus.orgCreatedAt}`,
        needsPolicyChange: `${googleStatus.needsPolicyChange}`,
      },
    })

    console.log(msg)
  }
}
