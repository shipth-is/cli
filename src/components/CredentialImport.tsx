import React from 'react'
import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import {importCredential, ImportCredentialProps} from '@cli/api/index.js'

interface Props extends ImportCredentialProps {
  onComplete: () => void
}

export const CredentialImport = ({onComplete, ...importProps}: Props) => {
  const [isImporting, setIsImporting] = React.useState(true)

  React.useEffect(() => {
    setIsImporting(true)
    importCredential(importProps).then(() => {
      setIsImporting(false)
      return onComplete()
    })
  }, [])

  return isImporting ? (
    <Box>
      <Text>{`Importing credential from ${importProps.zipPath}...`}</Text>
      <Spinner type="dots" />
    </Box>
  ) : (
    <Text>Import complete</Text>
  )
}
