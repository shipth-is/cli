import React, {useState} from 'react'
import {Box, Text} from 'ink'
import {Alert, TextInput, TextInputProps} from '@inkjs/ui'

import {EditableProject} from '@cli/types/api.js'

interface TextInputWithLabelProps extends TextInputProps {
  label: string
}

const TextInputWithLabel = ({label, ...rest}: TextInputWithLabelProps) => (
  <Box flexDirection="row" gap={1}>
    <Text>{label}</Text>
    <TextInput {...rest} />
  </Box>
)

interface Props {
  gameInfo: EditableProject
  onSubmit: (gameInfo: EditableProject) => void
}

export const GameInfoForm = ({gameInfo, onSubmit}: Props): JSX.Element => {
  const [activeInput, setActiveInput] = useState('name')
  const [name, setName] = useState(gameInfo.name)
  const [error, setError] = useState<string | null>(null)
  const [androidPackageName, setAndroidPackageName] = useState(gameInfo?.details?.androidPackageName)

  // Go to next input when name is submitted
  const handleSubmitName = () => {
    setError(null)
    if (name.length === 0) {
      setError('Please enter a name for your game')
      return
    }
    setActiveInput('androidPackageName')
  }

  // Save both values when androidPackageName is submitted
  const handleSubmitPackageName = () => {
    setError(null)
    const packageRegex = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/
    if (!packageRegex.test(`${androidPackageName}`)) {
      setError('Please enter a valid package name e.g. com.flappy.souls')
      return
    }

    onSubmit({
      ...gameInfo,
      name,
      details: {
        ...gameInfo.details,
        androidPackageName,
      },
    })
  }

  return (
    <>
      <Text bold>Please confirm the following information about your game</Text>
      {error && <Alert variant="error">{error}</Alert>}
      <Box flexDirection="column" marginLeft={1}>
        <TextInputWithLabel
          label="Game name:"
          isDisabled={activeInput !== 'name'}
          defaultValue={name}
          placeholder="Enter the name of your game..."
          onChange={setName}
          onSubmit={handleSubmitName}
        />

        <TextInputWithLabel
          label="Android package name :"
          isDisabled={activeInput !== 'androidPackageName'}
          defaultValue={androidPackageName}
          placeholder="e.g. com.flappy.souls"
          onChange={setAndroidPackageName}
          onSubmit={handleSubmitPackageName}
        />
      </Box>
    </>
  )
}
