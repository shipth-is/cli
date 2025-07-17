import {TextInput, TextInputProps} from '@inkjs/ui'
import {Box, Text, TextProps} from 'ink'

interface FormTextInputProps extends TextInputProps {
  label: string
  labelProps?: TextProps
}

export const FormTextInput = ({label, labelProps, ...rest}: FormTextInputProps) => (
  <Box flexDirection="row" gap={1}>
    <Text {...labelProps}>{label}</Text>
    <TextInput {...rest} />
  </Box>
)
