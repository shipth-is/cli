import {ScalarDict, AndroidServiceAccountSetupStatus as SetupStatus} from '@cli/types/api.js'
import {StatusTable} from '@cli/components/index.js'

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

interface Props {
  setupStatus: SetupStatus
}

export const SetupStatusTable = ({setupStatus}: Props) => {
  return <StatusTable title="Setup Status" statuses={statusToDict(setupStatus)} />
}
