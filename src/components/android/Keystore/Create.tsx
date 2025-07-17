import {useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import {Box} from 'ink'
import {useContext} from 'react'

import {getAuthedHeaders} from '@cli/api/index.js'
import {GameContext, RunWithSpinner, StepProps} from '@cli/components/index.js'
import {cacheKeys} from '@cli/constants/cacheKeys.js'
import {API_URL} from '@cli/constants/config.js'

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
      queryClient.invalidateQueries({queryKey: cacheKeys.projectCredentials({pageNumber: 0, projectId: gameId})})
    } catch (error) {
      onError(error as Error)
    }
  }

  return (
    <Box flexDirection="column" gap={1} {...boxProps}>
      {gameId && (
        <RunWithSpinner
          executeMethod={handleCreate}
          msgComplete="Keystore created"
          msgInProgress="Creating Keystore..."
          onComplete={onComplete}
        />
      )}
    </Box>
  )
}
