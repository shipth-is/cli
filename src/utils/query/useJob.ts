import {AxiosError} from 'axios'
import {useQuery, UseQueryResult} from '@tanstack/react-query'
import {DateTime} from 'luxon'

import {cacheKeys} from '@cli/constants/index.js'
import {getJob} from '@cli/api/index.js'
import {Job, JobDetails, JobStatus, ScalarDict} from '@cli/types'
import {getPlatformName, getShortDateTime, getShortTimeDelta, getShortUUID} from '@cli/utils/index.js'

export interface JobQueryProps {
  projectId: string
  jobId: string
}

export function getJobDetailsSummary(jobDetails: JobDetails): ScalarDict {
  const semanticVersion = jobDetails?.semanticVersion || 'N/A'
  const buildNumber = jobDetails?.buildNumber || 'N/A'
  const gitCommit = jobDetails?.gitCommitHash ? getShortUUID(jobDetails?.gitCommitHash) : 'N/A'
  const gitBranch = jobDetails?.gitBranch || 'N/A'
  return {
    version: `${semanticVersion} (${buildNumber})`,
    gitInfo: `${gitCommit} (${gitBranch})`,
  }
}


export function getJobSummary(job: Job, timeNow: DateTime): ScalarDict {
  const inProgress = ![JobStatus.COMPLETED, JobStatus.FAILED].includes(job.status)
  return {
    id: getShortUUID(job.id),
    ...getJobDetailsSummary(job.details),
    platform: getPlatformName(job.type),
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
