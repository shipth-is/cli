import type {SpinnerName} from 'cli-spinners'
import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'

import {toAppleHandledError} from '@cli/utils/errors.js'

import {ErrorBox} from './ErrorBox.js'

interface Props {
  executeMethod: () => Promise<any>
  msgComplete?: string
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
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    setIsInProgress(true)
    executeMethod()
      .then(() => {
        setIsInProgress(false)
        return onComplete()
      })
      // Without this, Node prints the whole error object, which for an Apple error includes
      // the request and the response, and the command still looks like it is running
      .catch((error_) => {
        process.exitCode = 1
        setIsInProgress(false)
        setError(toAppleHandledError(error_))
      })
  }, [])

  if (error) {
    return (
      <Box flexDirection="column">
        <Text>{msgInProgress}</Text>
        <ErrorBox error={error} />
      </Box>
    )
  }

  if (!isInProgress && !msgComplete) return <></>

  return (
    <Box>
      <Text>{isInProgress ? msgInProgress : msgComplete}</Text>
      {isInProgress && <Spinner type={spinnerType} />}
    </Box>
  )
}
