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
  const gitCommit = jobDetails?.gitCommitHash ? getShortUUID(jobDetails.gitCommitHash) : ''
  const gitBranch = jobDetails?.gitBranch || ''

  // To maintain order
  const details: ScalarDict = {}
  details.version = `${semanticVersion} (${buildNumber})`
  details.gitInfo = gitCommit ? `${gitCommit} (${gitBranch})` : ''

  return details
}

export function getJobSummary(job: Job, timeNow: DateTime): ScalarDict {
  const inProgress = ![JobStatus.COMPLETED, JobStatus.FAILED].includes(job.status);
  const details = getJobDetailsSummary(job.details);
  const summary: ScalarDict = {};
  // To maintain order
  summary.id = getShortUUID(job.id);
  summary.version = details.version;
  summary.gitInfo = details.gitInfo;
  summary.platform = getPlatformName(job.type);
  summary.status = job.status;
  summary.createdAt = getShortDateTime(job.createdAt);
  summary.runtime = getShortTimeDelta(job.createdAt, inProgress ? timeNow : job.updatedAt);

  return summary;
}

export const useJob = (props: JobQueryProps): UseQueryResult<Job, AxiosError> =>
  useQuery<Job, AxiosError>({
    queryFn: () => getJob(props.jobId, props.projectId),
    queryKey: cacheKeys.job(props),
  })
