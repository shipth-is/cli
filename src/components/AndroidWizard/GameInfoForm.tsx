import React, {useState} from 'react'
import {Box, Text} from 'ink'
import {TextInput, TextInputProps} from '@inkjs/ui'

import {StepProps} from './utils.js'

interface TextInputWithLabelProps extends TextInputProps {
  label: string
}

const TextInputWithLabel = ({label, ...rest}: TextInputWithLabelProps) => (
  <Box flexDirection="row" gap={1}>
    <Text>{label}</Text>
    <TextInput {...rest} />
  </Box>
)

export const GameInfoForm = ({command, onComplete, onError}: StepProps): JSX.Element => {
  const [activeInput, setActiveInput] = useState('name')
  const [name, setName] = useState('')
  const [androidPackageName, setAndroidPackageName] = useState('')

  // Go to next input when name is submitted
  const handleSubmitName = () => {
    setActiveInput('androidPackageName')
  }

  // Save both values when androidPackageName is submitted
  const handleSubmitPackageName = async () => {
    onComplete({name, details: {androidPackageName}})
  }

  return (
    <Box flexDirection="column" gap={1} borderStyle="single" margin={1}>
      <Text bold>Please confirm the following information about your game</Text>
      <Box flexDirection="column" marginLeft={1}>
        <TextInputWithLabel
          label="Game name:"
          isDisabled={activeInput !== 'name'}
          placeholder="Enter the name of your game..."
          onChange={setName}
          onSubmit={handleSubmitName}
        />

        <TextInputWithLabel
          label="Android package name :"
          isDisabled={activeInput !== 'androidPackageName'}
          placeholder="e.g. com.flappy.souls"
          onChange={setAndroidPackageName}
          onSubmit={handleSubmitPackageName}
        />
      </Box>
    </Box>
  )
}
