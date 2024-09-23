import {PageAndSortParams} from '@cli/types.js'
import {JobQueryProps} from '@cli/utils/query/useJob.js'

export interface JobLogsCacheKeyProps {
  projectId: string
  jobId: string
}

export interface ProjectCredentialsCacheKeyProps extends PageAndSortParams {
  projectId: string
}

export const cacheKeys = {
  job: (props: JobQueryProps) => ['job', ...Object.values(props)],
  jobLogs: (props: JobLogsCacheKeyProps) => ['jobLogs', ...Object.values(props)],
  userCredentials: (props: PageAndSortParams) => ['userCredentials', ...Object.values(props)],
  projectCredentials: (props: ProjectCredentialsCacheKeyProps) => ['projectCredentials', ...Object.values(props)],
}
