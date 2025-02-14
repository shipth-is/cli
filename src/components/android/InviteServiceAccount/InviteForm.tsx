import {useState} from 'react'
import {Box, Text} from 'ink'
import {Alert} from '@inkjs/ui'

import {FormTextInput} from '@cli/components/index.js'

interface Props {
  // TODO: no initial values
  onSubmit: (accountId: string) => void
}

export const InviteForm = ({onSubmit}: Props): JSX.Element => {
  const [error, setError] = useState<string | null>(null)
  const [accountId, setAccountId] = useState<string>('')

  const handleSubmitAccountId = () => {
    setError(null)
    // numeric only, between 10 and 20 digits
    const idRegEx = /^\d{10,20}$/
    if (!idRegEx.test(`${accountId}`)) {
      setError('Please enter a valid developer ID')
      return
    }
    return onSubmit(accountId)
  }

  return (
    <>
      <Text bold>Please enter your Google Play Account ID</Text>
      {error && <Alert variant="error">{error}</Alert>}
      <Box flexDirection="column" marginLeft={1}>
        <FormTextInput
          label="Google Play Account ID:"
          defaultValue={accountId}
          placeholder="e.g. 8110853839480950872"
          onChange={setAccountId}
          onSubmit={handleSubmitAccountId}
        />
      </Box>
    </>
  )
}
