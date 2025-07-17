import {UseQueryResult, useQuery} from '@tanstack/react-query'
import {AxiosError} from 'axios'

import {getGoogleStatus} from '@cli/api/index.js'
import {cacheKeys} from '@cli/constants/cacheKeys.js'
import {GoogleStatusResponse} from '@cli/types/api.js'

export const useGoogleStatus = (): UseQueryResult<GoogleStatusResponse, AxiosError> => useQuery<GoogleStatusResponse, AxiosError>({
    queryFn: getGoogleStatus,
    queryKey: cacheKeys.googleStatus(),
  })
