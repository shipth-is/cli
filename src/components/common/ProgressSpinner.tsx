import {ProgressBar} from '@inkjs/ui'
import {Box, Text, BoxProps, TextProps} from 'ink'
import Spinner from 'ink-spinner'
import type {SpinnerName} from 'cli-spinners'

interface Props {
  progress?: number | null
  label?: string
  spinnerType?: SpinnerName
  labelProps?: TextProps
  boxProps?: BoxProps
}

// A progress bar with a label and spinner
export const ProgressSpinner = ({progress, label, spinnerType, labelProps, boxProps}: Props): JSX.Element => (
  <>
    <Box flexDirection="column" gap={1} {...boxProps}>
      <Box flexDirection="row" gap={1}>
        {label && label != '' && <Text {...labelProps}>{label}</Text>}
        <ProgressBar value={progress || 0} />
        <Text>{Math.floor(progress || 0)}%</Text>
        <Spinner type={spinnerType} />
      </Box>
    </Box>
  </>
)
