import {Box, Text} from 'ink'
import {TextInput, TextInputProps} from '@inkjs/ui'

interface FormTextInputProps extends TextInputProps {
  label: string
}

export const FormTextInput = ({label, ...rest}: FormTextInputProps) => (
  <Box flexDirection="row" gap={1}>
    <Text>{label}</Text>
    <TextInput {...rest} />
  </Box>
)
