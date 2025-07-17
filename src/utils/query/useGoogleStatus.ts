import {getGoogleStatus} from '@cli/api/index.js'
import {cacheKeys} from '@cli/constants/cacheKeys.js'
import {GoogleStatusResponse} from '@cli/types/api.js'
import {UseQueryResult, useQuery} from '@tanstack/react-query'
import {AxiosError} from 'axios'

export const useGoogleStatus = (): UseQueryResult<GoogleStatusResponse, AxiosError> => useQuery<GoogleStatusResponse, AxiosError>({
    queryFn: getGoogleStatus,
    queryKey: cacheKeys.googleStatus(),
  })
