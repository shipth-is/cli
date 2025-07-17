import {getGoogleStatus, getProject, getProjectCredentials} from '@cli/api/index.js'
import {BaseCommand} from '@cli/baseCommands/baseCommand.js'

import {CredentialsType, Platform} from '@cli/types/index.js'
import {fetchKeyTestResult, KeyTestError, KeyTestStatus, queryBuilds} from '@cli/utils/index.js'

export enum StepStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  WARN = 'WARN',
}

export const Steps = [
  'createGame',
  'createKeystore',
  'connectGoogle',
  'createServiceAccount',
  'createInitialBuild',
  'createGooglePlayGame',
  'inviteServiceAccount',
] as const

export type Step = (typeof Steps)[number]

// Determines the initial status of a step
// We apply what is running / failed over this
export const getStepInitialStatus = (
  step: Step,
  statusFlags: StatusFlags,
): StepStatus.SUCCESS | StepStatus.PENDING | StepStatus.WARN => {
  if (step === 'connectGoogle') {
    // Not connected but we don't need to be since we have key and have invited service account
    if (!statusFlags.hasGoogleConnection && statusFlags.hasServiceAccountKey && statusFlags.hasInvitedServiceAccount)
      return StepStatus.WARN
    return statusFlags.hasGoogleConnection ? StepStatus.SUCCESS : StepStatus.PENDING
  }

  if (step === 'createInitialBuild') {
    // App exists but we don't have an initial build (it is only needed to create the game in google play)
    if (!statusFlags.hasInitialBuild && statusFlags.hasGooglePlayGame) return StepStatus.WARN
    return statusFlags.hasInitialBuild ? StepStatus.SUCCESS : StepStatus.PENDING
  }

  const base: Partial<Record<Step, boolean>> = {
    createGame: statusFlags.hasGameName && statusFlags.hasAndroidPackageName,
    createKeystore: statusFlags.hasAndroidKeystore,
    createServiceAccount: statusFlags.hasServiceAccountKey,
    createGooglePlayGame: statusFlags.hasGooglePlayGame,
    inviteServiceAccount: statusFlags.hasInvitedServiceAccount,
  }

  return base[step] ? StepStatus.SUCCESS : StepStatus.PENDING
}

// All the data points we need to determine the status of each step
export interface StatusFlags {
  hasShipThisProject: boolean
  hasGameName: boolean
  hasAndroidPackageName: boolean
  hasAndroidKeystore: boolean
  hasGoogleConnection: boolean
  hasServiceAccountKey: boolean
  hasInitialBuild: boolean
  hasGooglePlayGame: boolean
  hasInvitedServiceAccount: boolean
}

// Get the values needed to determine the status of each step at the same time
// Needs the command context to get the project config
export const getStatusFlags = async (cmd: BaseCommand<any>): Promise<StatusFlags> => {
  // Get the project config if there from the current working directory
  const projectConfig = cmd.getProjectConfigSafe()
  const projectId = projectConfig.project?.id

  const project = !!projectId && (await getProject(projectId))
  const hasShipThisProject = !!project

  const hasGameName = project && !!project?.name
  const hasAndroidPackageName = project && !!project?.details?.androidPackageName

  const projectCredentials = hasShipThisProject ? await getProjectCredentials(project.id) : []
  const hasAndroidKeystore = projectCredentials.some(
    (cred) => cred.isActive && cred.platform === Platform.ANDROID && cred.type == CredentialsType.CERTIFICATE,
  )
  const googleStatus = await getGoogleStatus()
  const hasGoogleConnection = googleStatus.isAuthenticated

  const hasServiceAccountKey = projectCredentials.some(
    (cred) => cred.isActive && cred.platform == Platform.ANDROID && cred.type == CredentialsType.KEY,
  )

  const buildsResponse = !!projectId && hasShipThisProject && (await queryBuilds({projectId, pageNumber: 0}))
  const hasInitialBuild = !!buildsResponse && buildsResponse.data.some((build) => build.platform === Platform.ANDROID)

  const testResult = projectId ? await fetchKeyTestResult({projectId}) : null

  const hasGooglePlayGame =
    (testResult && testResult?.status === KeyTestStatus.SUCCESS) ||
    (testResult?.status === KeyTestStatus.ERROR && testResult?.error === KeyTestError.NOT_INVITED)

  const hasInvitedServiceAccount = testResult ? testResult?.status === KeyTestStatus.SUCCESS : false

  return {
    hasShipThisProject,
    hasGameName,
    hasAndroidPackageName,
    hasAndroidKeystore,
    hasGoogleConnection,
    hasServiceAccountKey,
    hasInitialBuild,
    hasGooglePlayGame,
    hasInvitedServiceAccount,
  }
}

export const isComplete = (statusFlags: StatusFlags): boolean => {
  type StatusFlagKey = keyof StatusFlags
  const needed: StatusFlagKey[] = [
    'hasShipThisProject',
    'hasGameName',
    'hasAndroidPackageName',
    'hasAndroidKeystore',
    'hasServiceAccountKey',
    'hasGooglePlayGame',
    'hasInvitedServiceAccount',
  ]
  return needed.every((key) => statusFlags[key as keyof StatusFlags])
}
