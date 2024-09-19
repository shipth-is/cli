import {Command, Flags} from '@oclif/core'
import {BaseAuthenticatedCommand} from './baseAuthenticatedCommand.js'
import {getProject} from '@cli/api/index.js'
import {Project, ProjectCredential} from '@cli/types.js'
import {getProjectCredentials} from '@cli/api/credentials/index.js'

export abstract class BaseGameCommand<T extends typeof Command> extends BaseAuthenticatedCommand<T> {
  static override flags = {
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  protected async getGame(): Promise<Project> {
    try {
      const {flags} = this
      if (flags.gameId) {
        return await getProject(flags.gameId) // this should work with the short id too
      }
      this.ensureWeAreInAProjectDir()
      const {project} = await this.getProjectConfig()
      if (!project) throw new Error('No project')
      return await getProject(project.id)
    } catch (e: any) {
      if (e?.response?.status === 404) {
        this.error('Game not found - please check you have access')
      } else throw e
    }
  }

  protected async getGameCredentials(): Promise<ProjectCredential[]> {
    const {project} = await this.getProjectConfig()
    if (!project) throw new Error('No project')
    const projectCredentials = await getProjectCredentials(project.id)
    return projectCredentials
  }
}
