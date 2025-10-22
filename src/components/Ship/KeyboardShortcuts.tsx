import {Dispatch, SetStateAction} from 'react'
import {Text} from 'ink'
import open from 'open'

import {getShortAuthRequiredUrl} from '@cli/api/index.js'
import {Job} from '@cli/types/api.js'
import {useSafeInput} from '@cli/utils/index.js'

interface KeyboardShortcutsProps {
  onToggleJobLogs: Dispatch<SetStateAction<boolean>>
  gameId?: string
  jobs?: Job[] | null
}

export const KeyboardShortcuts = ({onToggleJobLogs, gameId, jobs}: KeyboardShortcutsProps) => {
  useSafeInput(async (input) => {
    if (!gameId) return
    const i = input.toLowerCase()
    switch (i) {
      case 'l': {
        onToggleJobLogs((prev) => !prev)
        break
      }

      case 'b': {
        const dashUrl = jobs?.length === 1 ? `/games/${gameId}/job/${jobs[0].id}` : `/games/${gameId}`
        const url = await getShortAuthRequiredUrl(dashUrl)
        await open(url)
        break
      }
    }
  })

  return (
    <>
      <Text>Press L to show and hide the job logs.</Text>
      <Text>Press B to open the ShipThis dashboard in your browser.</Text>
    </>
  )
}
