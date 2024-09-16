import {AxiosError} from 'axios'
import {useQuery, UseQueryResult} from '@tanstack/react-query'

import {cacheKeys} from '@cli/constants/index.js'
import {getJob} from '@cli/api/index.js'
import {Job} from '@cli/types.js'

export interface JobQueryProps {
  projectId: string
  jobId: string
}

export const useJob = (props: JobQueryProps): UseQueryResult<Job, AxiosError> => {
  return useQuery<Job, AxiosError>({
    queryKey: cacheKeys.job(props),
    queryFn: () => getJob(props.jobId, props.projectId),
  })
}
