import {FormTextInput} from '@cli/components/index.js'
import {Alert} from '@inkjs/ui'
import {Box} from 'ink'
import {useState} from 'react'

interface Props {
  // TODO: no initial values
  onSubmit: (accountId: string) => void
}

export const InviteForm = ({onSubmit}: Props): JSX.Element => {
  const [error, setError] = useState<null | string>(null)
  const [accountId, setAccountId] = useState<string>('')

  const handleSubmitAccountId = () => {
    setError(null)
    // numeric only, between 10 and 20 digits
    const idRegEx = /^\d{10,20}$/
    if (!idRegEx.test(`${accountId}`)) {
      setError('Please enter a valid Google Play Account ID (10-20 digits)')
      return
    }

    return onSubmit(accountId)
  }

  return (
    <>
      <Box flexDirection="column" marginLeft={1}>
        <FormTextInput
          defaultValue={accountId}
          label="Please enter your Google Play Account ID:"
          labelProps={{bold: true}}
          onChange={setAccountId}
          onSubmit={handleSubmitAccountId}
          placeholder="e.g. 8110853839480950872"
        />
        {error && <Alert variant="error">{error}</Alert>}
      </Box>
    </>
  )
}
