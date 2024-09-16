import {JobQueryProps} from '@cli/utils/query/useJob.js'
import {JobLogsQueryProps} from '@cli/utils/query/useJobLogs.js'

export const cacheKeys = {
  job: (props: JobQueryProps) => ['job', ...Object.values(props)],
  jobLogs: (props: JobLogsQueryProps) => ['jobLogs', ...Object.values(props)],
}
