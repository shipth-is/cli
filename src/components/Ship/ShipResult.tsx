import {Box} from 'ink'

import {WEB_URL} from '@cli/constants/config.js'
import {Job, ShipGameFlags} from '@cli/types/index.js'
import {getShortUUID} from '@cli/utils/index.js'

import {Markdown, JobLogTail} from '@cli/components/index.js'

interface ShipResultProps {
  gameId: string
  failedJobs: Job[] | null
  gameFlags: ShipGameFlags | null
}

export const ShipResult = ({gameId, failedJobs, gameFlags}: ShipResultProps) => {
  return (
    failedJobs && (
      <>
        {failedJobs.length === 0 && (
          <Markdown
            filename="ship-success.md.ejs"
            templateVars={{
              gameBuildsUrl: `${WEB_URL}games/${getShortUUID(gameId)}/builds`,
              wasPublished: !gameFlags?.skipPublish,
            }}
          />
        )}
        {failedJobs.length > 0 && (
          <>
            <Markdown
              filename="ship-failure.md.ejs"
              templateVars={{
                jobDashboardUrl: `${WEB_URL}games/${getShortUUID(gameId)}/job/${getShortUUID(failedJobs[0].id)}`,
              }}
            />
            <Box marginTop={1}>
              {failedJobs.map((fj) => (
                <JobLogTail isWatching={false} jobId={fj.id} key={fj.id} length={10} projectId={fj.project.id} />
              ))}
            </Box>
          </>
        )}
      </>
    )
  )
}
