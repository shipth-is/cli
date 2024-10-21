import {DateTime} from 'luxon'
import type {Profile as AppleProfileType} from '@expo/apple-utils'
import {useQuery, UseQueryResult} from '@tanstack/react-query'

import {Profile, ProfileType} from '@cli/apple/expo.js'
import {getShortDate} from '@cli/utils/index.js'

import {Project, ProjectCredential, ScalarDict} from '@cli/types'

export interface AppleProfilesQueryProps {
  ctx: any
}

export type AppleProfileQueryResponse = AppleProfileType[] // TODO: type this

export async function queryAppleProfiles({ctx}: AppleProfilesQueryProps) {
  const appleProfiles = await Profile.getAsync(ctx, {
    query: {
      filter: {
        profileType: [ProfileType.IOS_APP_STORE],
      },
    },
  })
  return appleProfiles
}

export const canAppleProfileBeUsed = (
  appleProfile: AppleProfileType,
  project: Project,
  projectCredentials: ProjectCredential[],
): boolean => {
  try {
    if (!appleProfile.isValid) return false
    const profileBundleId = appleProfile.attributes.bundleId?.attributes.identifier
    const profileCertificateSerialNumber = appleProfile.attributes.certificates?.[0]?.attributes.serialNumber
    if (profileBundleId !== project.details?.iosBundleId) return false
    return projectCredentials.some(
      (credential) => credential.isActive && credential.serialNumber === profileCertificateSerialNumber,
    )
  } catch (e) {
    console.log(e)
    return false
  }
}

export function getAppleProfileSummary(
  appleProfile: AppleProfileType,
  project: Project,
  projectCredentials: ProjectCredential[],
): ScalarDict {
  return {
    id: appleProfile.id,
    name: appleProfile.attributes.name,
    platform: appleProfile.attributes.platform,
    expires: getShortDate(DateTime.fromISO(appleProfile.attributes.expirationDate)),
    canBeUsed: canAppleProfileBeUsed(appleProfile, project, projectCredentials),
  }
}

export const useAppleProfiles = (props: AppleProfilesQueryProps): UseQueryResult<AppleProfileQueryResponse> => {
  const queryResult = useQuery<AppleProfileQueryResponse>({
    queryKey: ['appleProfiles'],
    queryFn: () => queryAppleProfiles(props),
  })
  return queryResult
}
