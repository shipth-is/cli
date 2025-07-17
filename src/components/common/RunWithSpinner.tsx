import type {SpinnerName} from 'cli-spinners'
import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'

interface Props {
  executeMethod: () => Promise<any>
  msgComplete: string
  msgInProgress: string
  onComplete: () => void
  spinnerType?: SpinnerName
}

export const RunWithSpinner = ({
  executeMethod,
  msgComplete,
  msgInProgress,
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

  return (
    <Box>
      <Text>{isInProgress ? msgInProgress : msgComplete}</Text>
      {isInProgress && <Spinner type={spinnerType} />}
    </Box>
  )
}
