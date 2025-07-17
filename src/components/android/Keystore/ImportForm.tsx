import {FormTextInput} from '@cli/components/common/FormTextInput.js'
import {ImportKeystoreProps} from '@cli/utils/query/useImportKeystore.js'
import {Alert} from '@inkjs/ui'
import {Box} from 'ink'
import fs from 'node:fs'
import {useState} from 'react'

interface Props {
  importKeystoreProps: ImportKeystoreProps
  onSubmit: (importKeystoreProps: ImportKeystoreProps) => void
}

enum Inputs {
  jksFilePath = 'jksFilePath',
  password = 'password',
}

// The form only has one password input because the keystores we use for Godot have the
// same password for the keystore and the key.
export const ImportForm = ({importKeystoreProps, onSubmit}: Props): JSX.Element => {
  const [activeInput, setActiveInput] = useState<Inputs>(Inputs.jksFilePath)
  const [error, setError] = useState<null | string>(null)

  const [jksFilePath, setJksFilePath] = useState(importKeystoreProps.jksFilePath)
  const [password, setPassword] = useState(importKeystoreProps.keyPassword)

  const handleSubmitJksFilePath = () => {
    setError(null)
    if (!jksFilePath || jksFilePath.length === 0) {
      setError('Please enter a path to your jks file')
      return
    }

    if (!fs.existsSync(jksFilePath)) {
      setError('The file does not exist')
      return
    }

    setActiveInput(Inputs.password)
  }

  const handleSubmitPassword = () => {
    setError(null)
    if (!password || password.length === 0) {
      setError('Please enter a password')
      return
    }

    // TODO: any way to validate the password? Maybe have a confirmation field?
    // How to do a confirmation field if we pre-populate the password?
    onSubmit({
      ...importKeystoreProps,
      jksFilePath,
      keyPassword: password,
      keystorePassword: password,
    })
  }

  return (
    <>
      {error && <Alert variant="error">{error}</Alert>}
      <Box flexDirection="column" marginLeft={1}>
        <FormTextInput
          defaultValue={jksFilePath}
          isDisabled={activeInput !== Inputs.jksFilePath}
          label="Path to your jks file:"
          onChange={setJksFilePath}
          onSubmit={handleSubmitJksFilePath}
          placeholder="Enter the path to your jks file..."
        />
        <FormTextInput
          defaultValue={password}
          isDisabled={activeInput !== Inputs.password}
          label="Password:"
          onChange={setPassword}
          onSubmit={handleSubmitPassword}
          placeholder="Enter the password for your jks file..."
        />
      </Box>
    </>
  )
}
