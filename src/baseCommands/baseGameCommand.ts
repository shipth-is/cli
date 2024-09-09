import {Command} from '@oclif/core'
import {BaseAuthenticatedCommand} from './baseAuthenticatedCommand.js'
import {isCWDGodotGame} from '@cli/utils/index.js'
import {getProject} from '@cli/api/index.js'
import {Platform, Project} from '@cli/types.js'
import {getProjectCredentials, ProjectCredential, UserCredential} from '@cli/api/credentials/index.js'

interface PlatformStatus {
  setupPercent: number
  nextSteps: string[]
}

export abstract class BaseGameCommand<T extends typeof Command> extends BaseAuthenticatedCommand<T> {
  public async init(): Promise<void> {
    await super.init()

    if (!isCWDGodotGame()) {
      this.error('No Godot project detected. Please run this from a godot project directory.', {exit: 1})
    }

    if (!this.hasProjectConfig()) {
      this.error(
        'No shipthis config found. Please run `shipthis game create --name "Space Invaders"` to create a game.',
        {exit: 1},
      )
    }
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

  private haveAllCredentialsForPlatform(projectCredentials: ProjectCredential[], platform: Platform): boolean {}

  protected async getPlatformStatus(
    platform: Platform,
    userCredentials: UserCredential[],
    project: Project,
    projectCredentials: ProjectCredential[],
  ): Promise<PlatformStatus> {
    let setupPercent = 0

    // Assumes only 2 platforms
    const hasBundleSet =
      platform == Platform.IOS ? !!project.details?.iosBundleId : !!project.details?.androidPackageName

    if (!hasBundleSet) {
      return {setupPercent, nextSteps: [`Set the ${platform} bundle ID in the project settings`]}
    }

    // TODO: check if we have ALL the creds needed for a platform
    const hasCredentialsForPlatform = projectCredentials.some((c) => c.platform == platform)

    return {setupPercent, nextSteps}
  }
}
