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

// The UI components for each step have these props
export interface StepProps {
  onComplete: () => void
  onError: (error: Error) => void
}

// We apply what is running / failed over this
export const getStepInitialStatus = (
  step: Step,
  statusFlags: StatusFlags,
): StepStatus.SUCCESS | StepStatus.PENDING | StepStatus.WARN => {
  const base: any = {
    gameInfo: statusFlags.hasGameName && statusFlags.hasAndroidPackageName,
    createGame: statusFlags.hasShipThisProject,
    createKeystore: statusFlags.hasAndroidKeystore,
    createServiceAccount: statusFlags.hasServiceAccountKey,
    createGooglePlayGame: statusFlags.hasGooglePlayGame,
    inviteServiceAccount: statusFlags.hasInvitedServiceAccount,
  }

  if (step in base) return base[step] ? StepStatus.SUCCESS : StepStatus.PENDING
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

  throw new Error(`Unknown step: ${step}`)
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
  const projectConfig = await cmd.getProjectConfigSafe()
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
  const hasInitialBuild = !!buildsResponse && buildsResponse.data.length > 0

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
  const needed = [
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
