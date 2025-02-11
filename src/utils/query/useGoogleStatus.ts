import {AxiosError} from 'axios'
import {useQuery, UseQueryResult} from '@tanstack/react-query'

import {getGoogleStatus} from '@cli/api/index.js'
import {cacheKeys} from '@cli/constants/cacheKeys.js'
import {GoogleStatusResponse} from '@cli/types/api.js'

export const useGoogleStatus = (): UseQueryResult<GoogleStatusResponse, AxiosError> => {
  return useQuery<GoogleStatusResponse, AxiosError>({
    queryKey: cacheKeys.googleStatus(),
    queryFn: getGoogleStatus,
  })
}
