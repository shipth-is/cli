import {UseQueryResult, useQuery} from '@tanstack/react-query'
import axios, {AxiosError} from 'axios'

import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL, cacheKeys} from '@cli/constants/index.js'
import {
  CredentialsType,
  OffsetPaginatedResponse,
  PageAndSortParams,
  Platform,
  ProjectCredential,
  ScalarDict,
} from '@cli/types'
import {castArrayObjectDates, getShortDate, getShortUUID} from '@cli/utils/index.js'

// Props used for the query itself
export interface FetchProps extends PageAndSortParams {
  projectId: string
}

// Platform and type are filters - used in the useQuery select function
export interface ProjectCredentialsQueryProps extends FetchProps {
  platform?: Platform
  type?: CredentialsType
}

export type ProjectCredentialsQueryResponse = OffsetPaginatedResponse<ProjectCredential>

export async function queryProjectCredentials({
  projectId,
  ...pageAndSortParams
}: FetchProps): Promise<ProjectCredentialsQueryResponse> {
  try {
    const headers = getAuthedHeaders()
    const url = `${API_URL}/projects/${projectId}/credentials`
    const response = await axios.get(url, {headers, params: pageAndSortParams})
    return {
      ...response.data,
      data: castArrayObjectDates<ProjectCredential>(response.data.data),
    }
  } catch (error) {
    console.warn('queryProjectCredentials Error', error)
    throw error
  }
}

// How we typically display a project credential
export function getProjectCredentialSummary(credential: ProjectCredential): ScalarDict {
  return {
    createdAt: getShortDate(credential.createdAt),
    id: getShortUUID(credential.id),
    isActive: credential.isActive,
    serial: credential.serialNumber.slice(0, 30) + (credential.serialNumber.length > 30 ? '…' : ''),
    type: credential.type,
  }
}

export const useProjectCredentials = ({
  platform,
  type,
  ...fetchProps
}: ProjectCredentialsQueryProps): UseQueryResult<ProjectCredentialsQueryResponse, AxiosError> => {
  const queryResult = useQuery<ProjectCredentialsQueryResponse, AxiosError>({
    queryFn: async () => queryProjectCredentials(fetchProps),
    queryKey: cacheKeys.projectCredentials(fetchProps),
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
