import {Alert} from '@inkjs/ui'
import {Box, Text} from 'ink'
import {useState} from 'react'

import {FormTextInput} from '@cli/components/index.js'
import {EditableProject} from '@cli/types/api.js'

interface Props {
  gameInfo: EditableProject
  onSubmit: (gameInfo: EditableProject) => void
}

export const GameInfoForm = ({gameInfo, onSubmit}: Props): JSX.Element => {
  const [activeInput, setActiveInput] = useState('name')
  const [error, setError] = useState<null | string>(null)

  const [name, setName] = useState(gameInfo.name)
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
    const packageRegex = /^[A-Za-z]\w*(\.[A-Za-z]\w*)+$/
    if (!packageRegex.test(`${androidPackageName}`)) {
      setError('Please enter a valid package name e.g. com.flappy.souls')
      return
    }

    onSubmit({
      ...gameInfo,
      details: {
        ...gameInfo.details,
        androidPackageName,
      },
      name,
    })
  }

  return (
    <>
      <Text bold>Please confirm the following information about your game</Text>
      {error && <Alert variant="error">{error}</Alert>}
      <Box flexDirection="column" marginLeft={1}>
        <FormTextInput
          defaultValue={name}
          isDisabled={activeInput !== 'name'}
          label="Game name:"
          onChange={setName}
          onSubmit={handleSubmitName}
          placeholder="Enter the name of your game..."
        />

        <FormTextInput
          defaultValue={androidPackageName}
          isDisabled={activeInput !== 'androidPackageName'}
          label="Android package name :"
          onChange={setAndroidPackageName}
          onSubmit={handleSubmitPackageName}
          placeholder="e.g. com.flappy.souls"
        />
      </Box>
    </>
  )
}
