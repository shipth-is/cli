import type {SpinnerName} from 'cli-spinners'

import {ProgressBar} from '@inkjs/ui'
import {Box, BoxProps, Text, TextProps} from 'ink'
import Spinner from 'ink-spinner'

interface Props {
  boxProps?: BoxProps
  label?: string
  labelProps?: TextProps
  progress?: null | number
  spinnerType?: SpinnerName
}

// A progress bar with a label and spinner
export const ProgressSpinner = ({boxProps, label, labelProps, progress, spinnerType}: Props): JSX.Element => (
  <>
    <Box flexDirection="column" gap={1} {...boxProps}>
      <Box flexDirection="row" gap={1}>
        {label && label != '' && <Text {...labelProps}>{label}</Text>}
        <ProgressBar value={progress || 0} />
        <Box width={4}>
          <Text>{Math.floor(progress || 0)}%</Text>
        </Box>
        <Spinner type={spinnerType} />
      </Box>
    </Box>
  </>
)
