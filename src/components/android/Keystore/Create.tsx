import {Box} from 'ink'
import axios from 'axios'
import {useContext} from 'react'
import {useQueryClient} from '@tanstack/react-query'

import {API_URL} from '@cli/constants/config.js'
import {cacheKeys} from '@cli/constants/cacheKeys.js'
import {GameContext, StepProps, RunWithSpinner} from '@cli/components/index.js'
import {getAuthedHeaders} from '@cli/api/index.js'

export const CreateKeystore = ({onComplete, onError, ...boxProps}: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)
  const queryClient = useQueryClient()

  const handleCreate = async () => {
    try {
      if (!gameId) throw new Error('No game')
      const headers = await getAuthedHeaders()
      await axios.post(`${API_URL}/projects/${gameId}/credentials/android/certificate`, null, {
        headers,
      })
      queryClient.invalidateQueries({queryKey: cacheKeys.projectCredentials({projectId: gameId, pageNumber: 0})})
    } catch (err) {
      onError(err as Error)
    }
  }

  return (
    <Box flexDirection="column" gap={1} {...boxProps}>
      {gameId && (
        <RunWithSpinner
          executeMethod={handleCreate}
          msgInProgress="Creating Keystore..."
          msgComplete="Keystore created"
          onComplete={onComplete}
        />
      )}
    </Box>
  )
}
