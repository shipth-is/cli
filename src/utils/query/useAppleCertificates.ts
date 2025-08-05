import type {Certificate as Cert} from '@expo/apple-utils'
import {UseQueryResult, useQuery} from '@tanstack/react-query'
import {DateTime} from 'luxon'

import {Certificate, CertificateType} from '@cli/apple/expo.js'
import {ScalarDict, UserCredential} from '@cli/types'
import {getShortDate, getShortUUID} from '@cli/utils/index.js'

export interface AppleCertificatesQueryProps {
  ctx: any
}

export type AppleCertificateQueryResponse = Cert[]

export async function queryAppleCertificates({ctx}: AppleCertificatesQueryProps) {
  const appleCerts = await Certificate.getAsync(ctx, {
    query: {
      filter: {
        certificateType: [CertificateType.DISTRIBUTION, CertificateType.IOS_DISTRIBUTION],
      },
    },
  })
  return appleCerts
}

// Tells us if the Apple Cert can be used to ship a game
export const canAppleCertificateBeUsed = (cert: Cert, userCredentials: UserCredential[]): boolean => {
  // NB: different from the check for Apple API Keys
  if (cert.attributes.status !== 'Issued') return false
  return userCredentials.some((cred) => cred.isActive && cred.serialNumber === cert.attributes.serialNumber)
}

// How we typically display an Apple Cert - needs the userCredentials to determine if it can be used
export function getAppleCertificateSummary(cert: Cert, userCredentials: UserCredential[]): ScalarDict {
  const summary: ScalarDict = {};
  summary.id = getShortUUID(cert.id);
  summary.name = cert.attributes.name;
  summary.serial = cert.attributes.serialNumber;
  summary.expires = getShortDate(DateTime.fromISO(cert.attributes.expirationDate));
  summary.canBeUsed = canAppleCertificateBeUsed(cert, userCredentials);
  return summary;
}

export const useAppleCertificates = (
  props: AppleCertificatesQueryProps,
): UseQueryResult<AppleCertificateQueryResponse> => {
  const queryResult = useQuery<AppleCertificateQueryResponse>({
    queryFn: () => queryAppleCertificates(props),
    queryKey: ['appleCertificates'],
  })
  return queryResult
}
