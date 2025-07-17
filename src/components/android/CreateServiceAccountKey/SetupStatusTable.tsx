import {StatusTable} from '@cli/components/index.js'
import {ScalarDict, AndroidServiceAccountSetupStatus as SetupStatus} from '@cli/types/api.js'

function statusToDict(status: SetupStatus): ScalarDict {
  return {
    'Has Enabled API': status.hasEnabledApi,
    'Has Key': status.hasKey,
    'Has Project': status.hasProject,
    'Has Service Account': status.hasServiceAccount,
    'Has Signed In': status.hasSignedIn,
    'Has Uploaded Key': status.hasUploadedKey,
    Progress: status.progress,
  }
}

interface Props {
  setupStatus: SetupStatus
}

export const SetupStatusTable = ({setupStatus}: Props) => <StatusTable statuses={statusToDict(setupStatus)} title="Setup Status" />
