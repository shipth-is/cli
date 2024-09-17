import {JobQueryProps} from '@cli/utils/query/useJob.js'

export interface JobLogsCacheKeyProps {
  projectId: string
  jobId: string
}

export const cacheKeys = {
  job: (props: JobQueryProps) => ['job', ...Object.values(props)],
  jobLogs: (props: JobLogsCacheKeyProps) => ['jobLogs', props.jobId, props.projectId],
}
