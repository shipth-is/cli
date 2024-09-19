import React from 'react'
import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import type {SpinnerName} from 'cli-spinners'

interface Props {
  executeMethod: () => Promise<any>
  msgInProgress: string
  msgComplete: string
  onComplete: () => void
  spinnerType?: SpinnerName
}

export const RunWithSpinner = ({
  executeMethod,
  msgInProgress,
  msgComplete,
  onComplete,
  spinnerType,
}: Props): JSX.Element => {
  const [isInProgress, setIsInProgress] = React.useState(true)

  React.useEffect(() => {
    setIsInProgress(true)
    executeMethod().then(() => {
      setIsInProgress(false)
      return onComplete()
    })
  }, [])

  return isInProgress ? (
    <Box>
      <Text>{msgInProgress}</Text>
      <Spinner type={spinnerType} />
    </Box>
  ) : (
    <Text>{msgComplete}</Text>
  )
}
