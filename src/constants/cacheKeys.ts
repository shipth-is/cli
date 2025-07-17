import {PageAndSortParams} from '@cli/types'
import {StatusQueryProps} from '@cli/utils/query/useAndroidServiceAccountSetupStatus.js'
import {TestQueryProps} from '@cli/utils/query/useAndroidServiceAccountTestResult.js'
import {BuildsQueryProps} from '@cli/utils/query/useBuilds.js'
import {JobQueryProps} from '@cli/utils/query/useJob.js'
import {JobLogsQueryProps} from '@cli/utils/query/useJobLogs.js'
import {JobsQueryProps} from '@cli/utils/query/useJobs.js'
import {FetchProps} from '@cli/utils/query/useProjectCredentials.js'

export const cacheKeys = {
  androidKeyTestResult: (props: TestQueryProps) => ['androidKeyTestResult', ...Object.values(props)],
  androidSetupStatus: (props: StatusQueryProps) => ['androidSetupStatus', ...Object.values(props)],
  builds: (props: BuildsQueryProps) => ['builds', ...Object.values(props)],
  googleStatus: () => ['googleStatus'],
  job: (props: JobQueryProps) => ['job', ...Object.values(props)],
  jobLogs: (props: JobLogsQueryProps) => ['jobLogs', ...Object.values(props)],
  jobs: (props: JobsQueryProps) => ['jobs', ...Object.values(props)],
  projectCredentials: (props: FetchProps) => ['projectCredentials', ...Object.values(props)],
  userCredentials: (props: PageAndSortParams) => ['userCredentials', ...Object.values(props)],
}
