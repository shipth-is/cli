import {Box, Text, useInput} from 'ink'
import {Markdown, StepProps} from '@cli/components/index.js'
import {useState} from 'react'

import {ImportKeystoreProps} from '@cli/utils/query/useImportKeystore.js'

import {CreateKeystore} from './Create.js'
import {ImportForm} from './ImportForm.js'
import {ImportKeystore} from './Import.js'

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
    if (input === 'c') return setStage(Stage.Create)
    if (input === 'i') return setStage(Stage.ImportForm)
  })

  const handleImportFormSubmit = (newImportProps: ImportKeystoreProps) => {
    setImportKeystoreProps(newImportProps)
    setStage(Stage.ImportKeystore)
  }

  const renderStage = () => {
    switch (stage) {
      case Stage.Choose:
        return (
          <>
            <Text>Would you like to create a new keystore or import an existing one?</Text>
            <Text bold>Press C to create a new keystore</Text>
            <Text bold>Press I to import an existing keystore</Text>
          </>
        )
      case Stage.Create:
        return <CreateKeystore onComplete={onComplete} onError={onError} />
      case Stage.ImportForm:
        return <ImportForm onSubmit={handleImportFormSubmit} importKeystoreProps={importKeystoreProps} />
      case Stage.ImportKeystore:
        return <ImportKeystore onComplete={onComplete} onError={onError} importKeystoreProps={importKeystoreProps} />
    }
  }
  return (
    <Box flexDirection="column" gap={1} {...boxProps}>
      <Markdown filename="create-or-import-keystore.md" templateVars={{}} />
      {renderStage()}
    </Box>
  )
}
