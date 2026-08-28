import {Box} from 'ink'
import {useEffect, useState} from 'react'

import {Job} from '@cli/types/index.js'
import {FAILURE_LOG_TAIL_LENGTH, getPlatformLabel, getShipFailureVars} from '@cli/utils/ship/failure.js'

import {Markdown} from './common/Markdown.js'
import {JobLogTail} from './JobLogTail.js'

// Longest we wait for the failed job logs to arrive
const LOG_WAIT_MS = 10_000

interface Props {
  failedJobs: Job[]
  gameId: string
  // Says every log the summary will show has arrived, so a caller that exits
  // can wait for it
  onLogsLoaded?: () => void
  // Follow mode has already streamed the logs to the terminal, so it shows the
  // summary without a tail. Without the summary the run ends on raw build output.
  showLogTail: boolean
}

export const ShipFailure = ({failedJobs, gameId, onLogsLoaded, showLogTail}: Props): JSX.Element => {
  const [loadedTailIds, setLoadedTailIds] = useState<Set<string>>(new Set())
  const [gaveUpOnLogs, setGaveUpOnLogs] = useState<boolean>(false)

  // A set, because two tails can report in the same tick and the count must not
  // double for one job
  const handleTailLoaded = (jobId: string) => {
    setLoadedTailIds((prev) => new Set(prev).add(jobId))
  }

  // Each tail fetches its own logs, and exiting mid-fetch leaves a spinner on
  // screen. With no tail there is nothing to wait for.
  const tailsToLoad = showLogTail ? failedJobs.length : 0
  const areLogsLoaded = gaveUpOnLogs || loadedTailIds.size >= tailsToLoad

  useEffect(() => {
    if (tailsToLoad === 0) return
    // A tail that never answers must not hold the terminal open
    const timer = setTimeout(() => setGaveUpOnLogs(true), LOG_WAIT_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (areLogsLoaded) onLogsLoaded?.()
  }, [areLogsLoaded])

  return (
    <>
      <Markdown filename="ship-failure.md.ejs" templateVars={getShipFailureVars(failedJobs, gameId, {showLogTail})} />
      {showLogTail && (
        <Box flexDirection="column" marginTop={1}>
          {failedJobs.map((fj) => (
            <JobLogTail
              isWatching={false}
              jobId={fj.id}
              key={fj.id}
              length={FAILURE_LOG_TAIL_LENGTH}
              onLoaded={() => handleTailLoaded(fj.id)}
              projectId={fj.project.id}
              title={`Job logs - ${getPlatformLabel(fj.type)}`}
            />
          ))}
        </Box>
      )}
    </>
  )
}
