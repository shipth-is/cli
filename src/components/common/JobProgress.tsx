import {Job} from '@cli/types/api.js'
import {getPlatformName, useJobWatching} from '@cli/utils/index.js'
import {ProgressSpinner} from '@cli/components/index.js'

interface Props {
  job: Job
  onComplete?: (j: Job) => void
  onFailure?: (j: Job) => void
}

export const JobProgress = (props: Props) => {
  const {progress} = useJobWatching({
    projectId: props.job.project.id,
    jobId: props.job.id,
    isWatching: true,
    onComplete: props.onComplete,
    onFailure: props.onFailure,
  })

  const label = `${getPlatformName(props.job.type)} build progress...`

  return (
    <>
      <ProgressSpinner progress={progress} label={label} spinnerType="dots" />
    </>
  )
}
