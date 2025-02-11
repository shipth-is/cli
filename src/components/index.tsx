export * from './android/index.js'
export * from './apple/index.js'
export * from './common/index.js'
export * from './context/index.js'
export * from './wrappers/index.js'

export * from './BuildsTable.js'
export * from './JobLogTail.js'
export * from './JobStatusTable.js'
export * from './ProjectCredentialsTable.js'
export * from './UserCredentialsTable.js'

// The components for each sub-command run in the wizard have these props
// TODO: put in a better place
import {Box} from 'ink'
export interface StepProps extends React.ComponentPropsWithoutRef<typeof Box> {
  onComplete: () => void
  onError: (error: Error) => void
}
