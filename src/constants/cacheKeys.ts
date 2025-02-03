import {BuildsQueryProps} from '@cli/utils/query/useBuilds.js'
import {FetchProps} from '@cli/utils/query/useProjectCredentials.js'
import {JobLogsQueryProps} from '@cli/utils/query/useJobLogs.js'
import {JobQueryProps} from '@cli/utils/query/useJob.js'
import {PageAndSortParams} from '@cli/types'
import {StatusQueryProps} from '@cli/utils/query/useAndroidServiceAccountSetupStatus.js'

export const cacheKeys = {
  job: (props: JobQueryProps) => ['job', ...Object.values(props)],
  jobLogs: (props: JobLogsQueryProps) => ['jobLogs', ...Object.values(props)],
  userCredentials: (props: PageAndSortParams) => ['userCredentials', ...Object.values(props)],
  projectCredentials: (props: FetchProps) => ['projectCredentials', ...Object.values(props)],
  builds: (props: BuildsQueryProps) => ['builds', ...Object.values(props)],
  androidSetupStatus: (props: StatusQueryProps) => ['androidSetupStatus', ...Object.values(props)],
}
