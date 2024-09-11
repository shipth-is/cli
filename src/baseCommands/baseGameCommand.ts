import {Command} from '@oclif/core'
import {BaseAuthenticatedCommand} from './baseAuthenticatedCommand.js'
import {getProject} from '@cli/api/index.js'
import {Project} from '@cli/types.js'
import {getProjectCredentials, ProjectCredential} from '@cli/api/credentials/index.js'

export abstract class BaseGameCommand<T extends typeof Command> extends BaseAuthenticatedCommand<T> {
  public async init(): Promise<void> {
    await super.init()
    this.ensureWeHaveACurrentGame()
  }

  protected async getGame(): Promise<Project> {
    const {project: configProject} = await this.getProjectConfig()
    if (!configProject) throw new Error('No project')
    const project = await getProject(configProject.id)
    return project
  }

  protected async getGameCredentials(): Promise<ProjectCredential[]> {
    const {project} = await this.getProjectConfig()
    if (!project) throw new Error('No project')
    const projectCredentials = await getProjectCredentials(project.id)
    return projectCredentials
  }
}
