import {GameContext} from '@cli/components/index.js'
import {ImportKeystoreProps, useImportKeystore} from '@cli/utils/query/useImportKeystore.js'
import {Box, Text} from 'ink'
import Spinner from 'ink-spinner'
import {useContext, useEffect, useState} from 'react'

interface Props {
  importKeystoreProps: ImportKeystoreProps
  onComplete: () => void
  onError: (error: any) => void
}

export const ImportKeystore = ({importKeystoreProps, onComplete, onError}: Props): JSX.Element => {
  const {gameId} = useContext(GameContext)

  const importMutation = useImportKeystore()
  const [log, setLog] = useState<null | string>(null)

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
