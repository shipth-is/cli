import axios, {AxiosError} from 'axios'
import {useQuery, UseQueryResult} from '@tanstack/react-query'

import {
  CredentialsType,
  OffsetPaginatedResponse,
  PageAndSortParams,
  Platform,
  ScalarDict,
  ProjectCredential,
} from '@cli/types.js'

import {API_URL, cacheKeys} from '@cli/constants/index.js'
import {castArrayObjectDates, getShortDate, getShortUUID} from '@cli/utils/index.js'
import {getAuthedHeaders} from '@cli/api/index.js'

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
    id: getShortUUID(credential.id),
    type: credential.type,
    serial: credential.serialNumber,
    isActive: credential.isActive,
    createdAt: getShortDate(credential.createdAt),
  }
}

export const useProjectCredentials = ({
  platform,
  type,
  ...fetchProps
}: ProjectCredentialsQueryProps): UseQueryResult<ProjectCredentialsQueryResponse, AxiosError> => {
  const queryResult = useQuery<ProjectCredentialsQueryResponse, AxiosError>({
    queryKey: cacheKeys.projectCredentials(fetchProps),
    queryFn: async () => queryProjectCredentials(fetchProps),
    select: (data) => {
      // The api doesn't support filtering by platform or type, so we do it here
      if (!(platform || type)) return data
      return {
        ...data,
        data: data.data.filter((credential) => {
          return (!platform || credential.platform === platform) && (!type || credential.type === type)
        }),
      }
    },
  })

  return queryResult
}
