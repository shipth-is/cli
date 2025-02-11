import {Box} from 'ink'
import axios from 'axios'
import {useContext} from 'react'

import {getAuthedHeaders} from '@cli/api/index.js'
import {API_URL} from '@cli/constants/config.js'

import {GameContext, StepProps, RunWithSpinner} from '@cli/components/index.js'

export const CreateKeystore = (props: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)

  const handleCreate = async () => {
    // This is v simple
    if (!gameId) throw new Error('No command found')
    const headers = await getAuthedHeaders()
    await axios.post(`${API_URL}/projects/${gameId}/credentials/android/certificate`, null, {
      headers,
    })
  }

  return (
    <Box flexDirection="column" gap={1} borderStyle="single" margin={1}>
      <RunWithSpinner
        executeMethod={handleCreate}
        msgInProgress="Creating keystore..."
        msgComplete="Keystore created!"
        onComplete={props.onComplete}
      />
    </Box>
  )
}
