import {Command} from '@oclif/core'

import {getProject, getSelf, getTerms} from '@cli/api/index.js'
import {getRenderedMarkdown} from '@cli/components/index.js'
import {WEB_URL} from '@cli/constants/config.js'
import {HandledError} from '@cli/types/index.js'
import {getArchivedGameError} from '@cli/utils/errors.js'

import {BaseCommand} from './baseCommand.js'

export abstract class BaseAuthenticatedCommand<T extends typeof Command> extends BaseCommand<T> {
  static override flags = {}

  public async init(): Promise<void> {
    await super.init()
    const isAuthenticated = await this.isAuthenticated()
    if (!isAuthenticated) {
      this.error('No auth config found. Please run `shipthis login` to authenticate.', {exit: 1})
    }

    try {
      const self = await getSelf()

      // hasAcceptedTerms is set on first POST to /me/terms
      const accepted = Boolean(self.details?.hasAcceptedTerms)
      if (!accepted) {
        this.error('You must accept the agreements first. Please run `shipthis login --acceptAgreements` to do this.', {
          exit: 1,
        })
      }
    } catch (error: any) {
      if (error instanceof HandledError) {
        return this.error(error.message, {exit: 1})
      } else {
        throw error
      }
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

  // Stops a wizard before its first step if the game in shipthis.json is archived. Without
  // this the wizard does all the setup and then fails at the build.
  protected async ensureGameNotArchived(): Promise<void> {
    const gameId = this.hasProjectConfig() ? this.getProjectConfigSafe().project?.id : undefined
    if (!gameId) return

    // Any other problem with the game is left to the wizard steps, as before
    const game = await getProject(gameId).catch(() => null)
    if (!game?.archivedAt) return

    const {message, suggestions} = getArchivedGameError(game.id)
    this.error(message, {exit: 1, suggestions})
  }
}
