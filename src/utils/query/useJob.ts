import {UseQueryResult, useQuery} from '@tanstack/react-query'
import {AxiosError} from 'axios'
import {DateTime} from 'luxon'

import {getJob} from '@cli/api/index.js'
import {cacheKeys} from '@cli/constants/index.js'
import {Job, JobDetails, JobStatus, ScalarDict} from '@cli/types'
import {getPlatformName, getShortDateTime, getShortTimeDelta, getShortUUID} from '@cli/utils/index.js'

export interface JobQueryProps {
  jobId: string
  projectId: string
}

export function getJobDetailsSummary(jobDetails: JobDetails): ScalarDict {
  const semanticVersion = jobDetails?.semanticVersion || 'N/A'
  const buildNumber = jobDetails?.buildNumber || 'N/A'
  const gitCommit = jobDetails?.gitCommitHash ? getShortUUID(jobDetails?.gitCommitHash) : ''
  const gitBranch = jobDetails?.gitBranch || ''
  return {
    gitInfo: gitCommit ? `${gitCommit} (${gitBranch})` : '',
    version: `${semanticVersion} (${buildNumber})`,
  }
}

export function getJobSummary(job: Job, timeNow: DateTime): ScalarDict {
  const inProgress = ![JobStatus.COMPLETED, JobStatus.FAILED].includes(job.status)
  return {
    id: getShortUUID(job.id),
    ...getJobDetailsSummary(job.details),
    createdAt: getShortDateTime(job.createdAt),
    platform: getPlatformName(job.type),
    runtime: getShortTimeDelta(job.createdAt, inProgress ? timeNow : job.updatedAt),
    status: job.status,
  }
}

export const useJob = (props: JobQueryProps): UseQueryResult<Job, AxiosError> => useQuery<Job, AxiosError>({
    queryFn: () => getJob(props.jobId, props.projectId),
    queryKey: cacheKeys.job(props),
  })
