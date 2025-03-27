import {useContext, useEffect, useState} from 'react'

import {Text, Box} from 'ink'
import Spinner from 'ink-spinner'

import {GameContext} from '@cli/components/index.js'
import {ImportKeystoreProps, useImportKeystore} from '@cli/utils/query/useImportKeystore.js'

interface Props {
  onComplete: () => void
  onError: (error: any) => void
  importKeystoreProps: ImportKeystoreProps
}

export const ImportKeystore = ({onComplete, onError, importKeystoreProps}: Props): JSX.Element => {
  const {gameId} = useContext(GameContext)

  const importMutation = useImportKeystore()
  const [log, setLog] = useState<string | null>(null)

  useEffect(() => {
    if (!gameId) return

    const importOpts = {
      ...importKeystoreProps,
      gameId,
      log: setLog,
    }

    importMutation.mutateAsync(importOpts).catch(onError).then(onComplete)
  }, [gameId])

  return (
    <Box flexDirection="row" gap={1}>
      <Spinner type="dots" />
      {log && <Text>{log}</Text>}
    </Box>
  )
}
