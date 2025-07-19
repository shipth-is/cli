import {Box, Text, useInput} from 'ink'
import {useState} from 'react'

import {Markdown, StepProps} from '@cli/components/index.js'
import {ImportKeystoreProps} from '@cli/utils/query/useImportKeystore.js'

import {CreateKeystore} from './Create.js'
import {ImportKeystore} from './Import.js'
import {ImportForm} from './ImportForm.js'

enum Stage {
  Choose,
  Create,
  ImportForm,
  ImportKeystore,
}

export const CreateOrImport = ({onComplete, onError, ...boxProps}: StepProps): JSX.Element => {
  const [stage, setStage] = useState<Stage>(Stage.Choose)

  // TODO: pre-populate from the export_presets.cfg values?
  const [importKeystoreProps, setImportKeystoreProps] = useState<ImportKeystoreProps>({
    jksFilePath: '',
    keyPassword: '',
    keystorePassword: '',
  })

  useInput(async (input) => {
    if (stage !== Stage.Choose) return
    const i = input.toLowerCase()
    if (i === 'c') return setStage(Stage.Create)
    if (i === 'i') return setStage(Stage.ImportForm)
  })

  const handleImportFormSubmit = (newImportProps: ImportKeystoreProps) => {
    setImportKeystoreProps(newImportProps)
    setStage(Stage.ImportKeystore)
  }

  const renderStage = () => {
    switch (stage) {
      case Stage.Choose: {
        return (
          <>
            <Text>Would you like to create a new keystore or import an existing one?</Text>
            <Text bold>Press C to create a new keystore</Text>
            <Text bold>Press I to import an existing keystore</Text>
          </>
        )
      }

      case Stage.Create: {
        return <CreateKeystore onComplete={onComplete} onError={onError} />
      }

      case Stage.ImportForm: {
        return <ImportForm importKeystoreProps={importKeystoreProps} onSubmit={handleImportFormSubmit} />
      }

      case Stage.ImportKeystore: {
        return <ImportKeystore importKeystoreProps={importKeystoreProps} onComplete={onComplete} onError={onError} />
      }
    }
  }

  return (
    <Box flexDirection="column" gap={1} {...boxProps}>
      <Markdown filename="create-or-import-keystore.md" templateVars={{}} />
      {renderStage()}
    </Box>
  )
}
