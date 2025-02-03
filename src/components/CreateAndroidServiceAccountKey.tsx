import React, {useEffect} from 'react'

import {useAndroidServiceAccount} from '@cli/utils/hooks/index.js'
import {StatusTable} from './StatusTable.js'
import {ScalarDict, AndroidServiceAccountSetupStatus as SetupStatus} from '@cli/types/api.js'

interface Props {
  projectId: string
  onError: (error: Error) => void
  onComplete: () => void
}

function statusToDict(status: SetupStatus): ScalarDict {
  return {
    'Has Signed In': status.hasSignedIn,
    'Has Project': status.hasProject,
    'Has Service Account': status.hasServiceAccount,
    'Has Key': status.hasKey,
    'Has Uploaded Key': status.hasUploadedKey,
    'Has Enabled API': status.hasEnabledApi,
    Progress: status.progress,
  }
}

export const CreateAndroidServiceAccountKey = ({projectId, onError, onComplete}: Props) => {
  const {handleStart, setupStatus, isCreating, hasServiceAccountKey} = useAndroidServiceAccount({
    projectId,
    onError,
    onComplete,
  })

  useEffect(() => {
    handleStart()
  }, [])

  return <>{setupStatus && <StatusTable title="Setup Status" statuses={statusToDict(setupStatus)} />}</>
}
