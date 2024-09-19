import React from 'react'
import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import {exportCredential, ExportCredentialProps} from '@cli/api/index.js'

interface Props extends ExportCredentialProps {
  onComplete: () => void
}

export const CredentialExport = ({onComplete, ...exportProps}: Props) => {
  const [isExporting, setIsExporting] = React.useState(true)

  React.useEffect(() => {
    setIsExporting(true)
    exportCredential(exportProps).then(() => {
      setIsExporting(false)
      return onComplete()
    })
  }, [])

  return isExporting ? (
    <Box>
      <Text>{`Exporting to ${exportProps.zipPath}...`}</Text>
      <Spinner type="dots" />
    </Box>
  ) : (
    <Text>Export complete</Text>
  )
}
