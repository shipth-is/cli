import {AxiosError} from 'axios'
import {useQuery, UseQueryResult} from '@tanstack/react-query'
import {DateTime} from 'luxon'

import {cacheKeys} from '@cli/constants/index.js'
import {getJob} from '@cli/api/index.js'
import {Job, JobStatus, ScalarDict} from '@cli/types.js'
import {getShortDateTime, getShortTimeDelta, getShortUUID} from '@cli/utils/index.js'

export interface JobQueryProps {
  projectId: string
  jobId: string
}

export function getJobSummary(job: Job, timeNow: DateTime): ScalarDict {
  const inProgress = ![JobStatus.COMPLETED, JobStatus.FAILED].includes(job.status)
  const semanticVersion = job.details?.semanticVersion || 'N/A'
  const buildNumber = job.details?.buildNumber || 'N/A'
  const gitCommit = job.details?.gitCommitHash ? getShortUUID(job.details?.gitCommitHash) : 'N/A'
  const gitBranch = job.details?.gitBranch || 'N/A'
  return {
    id: getShortUUID(job.id),
    version: `${semanticVersion} (${buildNumber})`,
    gitInfo: `${gitCommit} (${gitBranch})`,
    platform: job.type,
    status: job.status,
    createdAt: getShortDateTime(job.createdAt),
    runtime: getShortTimeDelta(job.createdAt, inProgress ? timeNow : job.updatedAt),
  }
}

export const useJob = (props: JobQueryProps): UseQueryResult<Job, AxiosError> => {
  return useQuery<Job, AxiosError>({
    queryKey: cacheKeys.job(props),
    queryFn: () => getJob(props.jobId, props.projectId),
  })
}
