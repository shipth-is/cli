import axios, {AxiosError} from 'axios'
import {useQuery, UseQueryResult} from '@tanstack/react-query'

import {
  CredentialsType,
  OffsetPaginatedResponse,
  PageAndSortParams,
  Platform,
  ScalarDict,
  UserCredential,
} from '@cli/types.js'

import {API_URL, cacheKeys} from '@cli/constants/index.js'
import {castArrayObjectDates, getShortDate, getShortUUID} from '@cli/utils/index.js'
import {getAuthedHeaders} from '@cli/api/index.js'

export interface UserCredentialsQueryProps extends PageAndSortParams {
  platform?: Platform
  type?: CredentialsType
}

export type UserCredentialsQueryResponse = OffsetPaginatedResponse<UserCredential>

export async function queryUserCredentials(params: PageAndSortParams): Promise<UserCredentialsQueryResponse> {
  try {
    const headers = getAuthedHeaders()
    const url = `${API_URL}/credentials`
    const response = await axios.get(url, {headers, params})
    return {
      ...response.data,
      data: castArrayObjectDates<UserCredential>(response.data.data),
    }
  } catch (error) {
    console.warn('queryUserCredentials Error', error)
    throw error
  }
}

// How we typically display a user credential
export function getUserCredentialSummary(credential: UserCredential): ScalarDict {
  return {
    id: getShortUUID(credential.id),
    type: credential.type,
    serial: credential.serialNumber,
    isActive: credential.isActive,
    createdAt: getShortDate(credential.createdAt),
  }
}

export const useUserCredentials = ({
  platform,
  type,
  ...pageAndSortParams
}: UserCredentialsQueryProps): UseQueryResult<UserCredentialsQueryResponse, AxiosError> => {
  const queryResult = useQuery<UserCredentialsQueryResponse, AxiosError>({
    queryKey: cacheKeys.userCredentials(),
    queryFn: async () => queryUserCredentials(pageAndSortParams),
    select: (data) => {
      // The api doesn't support filtering by platform or type, so we do it here
      if (platform || type) {
        return {
          ...data,
          data: data.data.filter((credential) => {
            return (!platform || credential.platform === platform) && (!type || credential.type === type)
          }),
        }
      }
      return data
    },
  })
  return queryResult
}
