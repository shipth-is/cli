import type {Profile as AppleProfileType} from '@expo/apple-utils'

import {Profile, ProfileType} from '@cli/apple/expo.js'
import {Project, ProjectCredential, ScalarDict} from '@cli/types'
import {getShortDate} from '@cli/utils/index.js'
import {UseQueryResult, useQuery} from '@tanstack/react-query'
import {DateTime} from 'luxon'

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
  } catch (error) {
    console.log(error)
    return false
  }
}

export function getAppleProfileSummary(
  appleProfile: AppleProfileType,
  project: Project,
  projectCredentials: ProjectCredential[],
): ScalarDict {
  return {
    canBeUsed: canAppleProfileBeUsed(appleProfile, project, projectCredentials),
    expires: getShortDate(DateTime.fromISO(appleProfile.attributes.expirationDate)),
    id: appleProfile.id,
    name: appleProfile.attributes.name,
    platform: appleProfile.attributes.platform,
  }
}

export const useAppleProfiles = (props: AppleProfilesQueryProps): UseQueryResult<AppleProfileQueryResponse> => {
  const queryResult = useQuery<AppleProfileQueryResponse>({
    queryFn: () => queryAppleProfiles(props),
    queryKey: ['appleProfiles'],
  })
  return queryResult
}
