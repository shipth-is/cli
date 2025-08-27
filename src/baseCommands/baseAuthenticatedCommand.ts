import {Command} from '@oclif/core'

import {getSelf, getTerms} from '@cli/api/index.js'

import {BaseCommand} from './baseCommand.js'
import {getRenderedMarkdown} from '@cli/components/index.js'
import {WEB_URL} from '@cli/constants/config.js'

export abstract class BaseAuthenticatedCommand<T extends typeof Command> extends BaseCommand<T> {
  static override flags = {}

  public async init(): Promise<void> {
    await super.init()
    if (!this.isAuthenticated()) {
      this.error('No auth config found. Please run `shipthis login` to authenticate.', {exit: 1})
    }

    const self = await getSelf()

    // hasAcceptedTerms is set on first POST to /me/terms
    const accepted = Boolean(self.details?.hasAcceptedTerms)
    if (!accepted) {
      this.error('You must accept the agreements first. Please run `shipthis login --acceptAgreements` to do this.', {
        exit: 1,
      })
    }

    // Changes in accepted terms need to be displayed - but we are not exiting
    const terms = await getTerms()
    if (terms.changes.length > 0) {
      const warningMD = getRenderedMarkdown({
        filename: 'agreement-update.md.ejs',
        templateVars: {
          changes: terms.changes.map((a) => {
            return {
              ...a,
              url: new URL(a.path, WEB_URL).toString(),
            }
          }),
        },
      })
      console.log(warningMD)
    }
  }
}
