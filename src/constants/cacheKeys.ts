import {PageAndSortParams} from '@cli/types.js'
import {BuildsQueryProps} from '@cli/utils/query/useBuilds.js'
import {JobQueryProps} from '@cli/utils/query/useJob.js'
import {JobLogsQueryProps} from '@cli/utils/query/useJobLogs.js'
import {FetchProps} from '@cli/utils/query/useProjectCredentials.js'

export const cacheKeys = {
  job: (props: JobQueryProps) => ['job', ...Object.values(props)],
  jobLogs: (props: JobLogsQueryProps) => ['jobLogs', ...Object.values(props)],
  userCredentials: (props: PageAndSortParams) => ['userCredentials', ...Object.values(props)],
  projectCredentials: (props: FetchProps) => ['projectCredentials', ...Object.values(props)],
  builds: (props: BuildsQueryProps) => ['builds', ...Object.values(props)],
}
