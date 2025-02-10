import {Command, Flags} from '@oclif/core'
import {BaseAuthenticatedCommand} from './baseAuthenticatedCommand.js'
import {getProject, updateProject} from '@cli/api/index.js'
import {EditableProject, Project} from '@cli/types'

export abstract class BaseGameCommand<T extends typeof Command> extends BaseAuthenticatedCommand<T> {
  static override flags = {
    ...BaseAuthenticatedCommand.flags,
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async getGame(): Promise<Project> {
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

  public async updateGame(update: Partial<EditableProject>): Promise<Project> {
    const project = await this.getGame()
    const projectUpdate: EditableProject = {
      ...project,
      ...update,
    }
    const updatedProject = await updateProject(project.id, projectUpdate)
    await this.updateProjectConfig({project: updatedProject})
    return updatedProject
  }
}
