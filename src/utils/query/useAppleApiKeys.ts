import {UseQueryResult, useQuery} from '@tanstack/react-query'
import {DateTime} from 'luxon'

import {ApiKey} from '@cli/apple/expo.js'
import {ScalarDict, UserCredential} from '@cli/types'
import {getShortDate} from '@cli/utils/dates.js'

export interface AppleApiKeysQueryProps {
  ctx: any
}

export type AppleApiKeyQueryResponse = any[] // TODO: type this

export async function queryAppleApiKeys({ctx}: AppleApiKeysQueryProps) {
  const keys = await ApiKey.getAsync(ctx)
  const activeKeys = keys.filter((key) => key.attributes.isActive)
  return activeKeys
}

// Tells us if the Apple API Key can be used to ship a game
export const canAppleApiKeyBeUsed = (key: any, userCredentials: UserCredential[]): boolean => {
  if (!key.attributes.isActive) return false
  return userCredentials.some((cred) => cred.isActive && cred.serialNumber === key.id)
}

// How we typically display an Apple API Key - needs the userCredentials to determine if it can be used
export function getAppleApiKeySummary(key: any, userCredentials: UserCredential[]): ScalarDict {
  return {
    canBeUsed: canAppleApiKeyBeUsed(key, userCredentials),
    keyID: key.id,
    lastUsed: getShortDate(DateTime.fromISO(key.attributes.lastUsed)),
    name: key.attributes.nickname,
    roles: key.attributes.roles?.join(', '),
  }
}

export const useAppleApiKeys = (props: AppleApiKeysQueryProps): UseQueryResult<AppleApiKeyQueryResponse> => {
  const queryResult = useQuery<AppleApiKeyQueryResponse>({
    queryFn: () => queryAppleApiKeys(props),
    queryKey: ['appleApiKeys'],
  })
  return queryResult
}
