import {ProgressSpinner} from '@cli/components/index.js'
import {Job} from '@cli/types/api.js'
import {getPlatformName, useJobWatching} from '@cli/utils/index.js'

interface Props {
  job: Job
  onComplete?: (j: Job) => void
  onFailure?: (j: Job) => void
}

export const JobProgress = (props: Props) => {
  const {progress} = useJobWatching({
    isWatching: true,
    jobId: props.job.id,
    onComplete: props.onComplete,
    onFailure: props.onFailure,
    projectId: props.job.project.id,
  })

  const label = `${getPlatformName(props.job.type)} build progress...`

  return (
    <>
      <ProgressSpinner label={label} progress={progress} spinnerType="dots" />
    </>
  )
}
