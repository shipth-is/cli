import {UseQueryResult, useQuery} from '@tanstack/react-query'
import axios, {AxiosError} from 'axios'

import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL, cacheKeys} from '@cli/constants/index.js'
import {Build, OffsetPaginatedResponse, PageAndSortParams, Platform, ScalarDict} from '@cli/types'
import {
  castArrayObjectDates,
  getJobDetailsSummary,
  getPlatformName,
  getShortDateTime,
  getShortUUID,
} from '@cli/utils/index.js'

export interface BuildsQueryProps extends PageAndSortParams {
  projectId: string
}

export type BuildsQueryResponse = OffsetPaginatedResponse<Build>

export async function queryBuilds({projectId, ...pageAndSortParams}: BuildsQueryProps): Promise<BuildsQueryResponse> {
  try {
    const headers = getAuthedHeaders()
    const url = `${API_URL}/projects/${projectId}/builds`
    const response = await axios.get(url, {headers, params: pageAndSortParams})
    return {
      ...response.data,
      data: castArrayObjectDates<Build>(response.data.data),
    }
  } catch (error) {
    console.warn('queryBuilds Error', error)
    throw error
  }
}

// How we typically display a project build
export function getBuildSummary(build: Build): ScalarDict {
  const ext = build.buildType || (build.platform === Platform.IOS ? 'IPA' : 'AAB')
  const filename = `game.${ext.toLowerCase()}`

  return {
    id: getShortUUID(build.id),
    jobId: getShortUUID(build.jobId),
    ...getJobDetailsSummary(build.jobDetails),
    cmd: `shipthis game build download ${getShortUUID(build.id)} ${filename}`,
    createdAt: getShortDateTime(build.createdAt),
    type: `${getPlatformName(build.platform)} ${build.buildType || ''}`.trim(),
  }
}

export const useBuilds = (props: BuildsQueryProps): UseQueryResult<BuildsQueryResponse, AxiosError> => {
  const queryResult = useQuery<BuildsQueryResponse, AxiosError>({
    queryFn: async () => queryBuilds(props),
    queryKey: cacheKeys.builds(props),
  })

  return queryResult
}
