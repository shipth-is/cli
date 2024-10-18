import axios, {AxiosError} from 'axios'
import {useQuery, UseQueryResult} from '@tanstack/react-query'

import {OffsetPaginatedResponse, PageAndSortParams, ScalarDict, Build, Platform} from '@cli/types.js'

import {API_URL, cacheKeys} from '@cli/constants/index.js'
import {castArrayObjectDates, getPlatformName, getShortDateTime, getShortUUID} from '@cli/utils/index.js'
import {getAuthedHeaders} from '@cli/api/index.js'

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
  const filename = build.platform == Platform.IOS ? 'output.ipa' : 'output.apk'
  return {
    id: getShortUUID(build.id),
    platform: getPlatformName(build.platform),
    type: build.platform == Platform.IOS ? 'IPA' : 'APK',
    uploadedAt: getShortDateTime(build.updatedAt),
    cmd: `$ shipthis game build download ${getShortUUID(build.id)} ${filename}`,
  }
}

export const useBuilds = (props: BuildsQueryProps): UseQueryResult<BuildsQueryResponse, AxiosError> => {
  const queryResult = useQuery<BuildsQueryResponse, AxiosError>({
    queryKey: cacheKeys.builds(props),
    queryFn: async () => queryBuilds(props),
  })

  return queryResult
}
