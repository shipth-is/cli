import {getProject, updateProject} from '@cli/api/index.js'
import {EditableProject, Project} from '@cli/types'
import {Command, Flags} from '@oclif/core'

import {BaseAuthenticatedCommand} from './baseAuthenticatedCommand.js'

export abstract class BaseGameCommand<T extends typeof Command> extends BaseAuthenticatedCommand<T> {
  static override flags = {
    ...BaseAuthenticatedCommand.flags,
    gameId: Flags.string({char: 'g', description: 'The ID of the game'}),
  }

  public async getGame(): Promise<Project> {
    try {
      const gameId = await this.getGameId()
      if (!gameId) this.error('No game ID found.')
      return await getProject(gameId)
    } catch (error: any) {
      if (error?.response?.status === 404) {
        this.error('Game not found - please check you have access')
      } else throw error
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
