import {UseQueryResult, useQuery} from '@tanstack/react-query'
import axios, {AxiosError} from 'axios'

import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL, cacheKeys} from '@cli/constants/index.js'
import {
  CredentialsType,
  OffsetPaginatedResponse,
  PageAndSortParams,
  Platform,
  ScalarDict,
  UserCredential,
} from '@cli/types'
import {castArrayObjectDates, getShortDate, getShortUUID} from '@cli/utils/index.js'

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
  const summary: ScalarDict = {};
  // So that the order is maintained in the table (the linter will reorder if it is an object)
  summary.id = getShortUUID(credential.id);
  summary.type = credential.type;
  summary.serial = credential.serialNumber;
  summary.isActive = credential.isActive;
  summary.createdAt = getShortDate(credential.createdAt);
  return summary;
}

export const useUserCredentials = ({
  platform,
  type,
  ...pageAndSortParams
}: UserCredentialsQueryProps): UseQueryResult<UserCredentialsQueryResponse, AxiosError> => {
  const queryResult = useQuery<UserCredentialsQueryResponse, AxiosError>({
    queryFn: async () => queryUserCredentials(pageAndSortParams),
    queryKey: cacheKeys.userCredentials(pageAndSortParams),
    select(data) {
      // The api doesn't support filtering by platform or type, so we do it here
      if (!(platform || type)) return data
      return {
        ...data,
        data: data.data.filter((credential) => (!platform || credential.platform === platform) && (!type || credential.type === type)),
      }
    },
  })
  return queryResult
}
