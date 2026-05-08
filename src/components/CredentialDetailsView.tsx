import {Box, Text} from 'ink'
import {DateTime} from 'luxon'

import {
  CertificateCredentialDetails,
  CredentialsType,
  KeyCredentialDetails,
  ProjectCredential,
  UserCredential,
} from '@cli/types'
import {getShortDate} from '@cli/utils/index.js'

import {Title} from './common/Title.js'
import {TruncatedText} from './common/TruncatedText.js'

const ENTITLEMENT_LABELS: Record<string, string> = {
  'application-identifier': 'App Identifier',
  'com.apple.developer.team-identifier': 'Team ID',
  'keychain-access-groups': 'Keychain Groups',
}

type ExpiryStatus = 'expired' | 'expiring-soon' | null | undefined

const getStatusColor = (status: ExpiryStatus): string => {
  switch (status) {
    case 'expired':
      return 'red'
    case 'expiring-soon':
      return 'yellow'
    default:
      return 'white'
  }
}

const getExpiryStatus = (iso: string): ExpiryStatus => {
  const dt = DateTime.fromISO(iso)
  const now = DateTime.now()
  if (dt < now) return 'expired'
  if (dt < now.plus({months: 1})) return 'expiring-soon'
  return null
}

const ExpiryNote = ({status}: {status: ExpiryStatus}) => {
  if (!status) return null
  const color = getStatusColor(status)
  const message = status === 'expired' ? 'Expired' : 'Expiring soon'
  return <Text color={color}>{message}</Text>
}

interface DetailRowProps {
  expiryStatus?: ExpiryStatus
  label: string
  labelWidth: number
  value: string
}

const DetailRow = ({expiryStatus, label, labelWidth, value}: DetailRowProps) => (
  <Box flexDirection="row">
    <Box flexShrink={0} marginRight={2} width={labelWidth}>
      <Text>{label}</Text>
    </Box>
    <Box flexDirection="row" gap={1}>
      <TruncatedText bold color={getStatusColor(expiryStatus)}>{value}</TruncatedText>
      <ExpiryNote status={expiryStatus} />
    </Box>
  </Box>
)

const formatEntitlementValue = (value: unknown): string => {
  if (Array.isArray(value)) return value.map((v) => String(v)).join(', ')
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

interface RowDetails {
  expiryStatus?: ExpiryStatus
  label: string
  value: string
}

const getRows = (cred: UserCredential | ProjectCredential): RowDetails[] => {
  const rows: RowDetails[] = []
  const {details, type} = cred

  if (type === CredentialsType.CERTIFICATE) {
    const d = details as CertificateCredentialDetails
    if (d.certExpiresAt) {
      rows.push({
        expiryStatus: getExpiryStatus(d.certExpiresAt),
        label: 'Certificate Expiry',
        value: getShortDate(DateTime.fromISO(d.certExpiresAt)),
      })
    }

    if (d.profileExpiresAt) {
      rows.push({
        expiryStatus: getExpiryStatus(d.profileExpiresAt),
        label: 'Profile Expiry',
        value: getShortDate(DateTime.fromISO(d.profileExpiresAt)),
      })
    }

    if (d.profileEntitlements) {
      for (const [key, value] of Object.entries(d.profileEntitlements)) {
        rows.push({
          label: ENTITLEMENT_LABELS[key] ?? key,
          value: formatEntitlementValue(value),
        })
      }
    }
  }

  if (type === CredentialsType.KEY) {
    const d = details as KeyCredentialDetails
    if (d.serviceAccountEmail) {
      rows.push({label: 'Service Account Email', value: d.serviceAccountEmail})
    }
  }

  return rows
}

interface Props {
  credential: ProjectCredential | UserCredential
  title?: string
}

export const CredentialDetailsView = ({credential, title}: Props) => {
  const rows = getRows(credential)

  if (rows.length === 0) {
    return (
      <Box flexDirection="column" marginBottom={1}>
        {title && <Title>{title}</Title>}
        <Box marginLeft={2}>
          <Text>No additional details available for this credential.</Text>
        </Box>
      </Box>
    )
  }

  const labelWidth = Math.max(...rows.map((r) => r.label.length)) + 2

  return (
    <Box flexDirection="column" marginBottom={1}>
      {title && <Title>{title}</Title>}
      <Box flexDirection="column" marginLeft={2}>
        {rows.map((row) => (
          <DetailRow
            expiryStatus={row.expiryStatus}
            key={row.label}
            label={row.label}
            labelWidth={labelWidth}
            value={row.value}
          />
        ))}
        <Box marginTop={1}>
          <DetailRow label="ID" labelWidth={labelWidth} value={credential.id} />
        </Box>
        <DetailRow label="Serial" labelWidth={labelWidth} value={credential.serialNumber} />
        <DetailRow label="Created" labelWidth={labelWidth} value={getShortDate(credential.createdAt)} />
      </Box>
    </Box>
  )
}
