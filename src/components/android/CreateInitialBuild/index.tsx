import {useContext} from 'react'

import {GameContext, StepProps} from '@cli/components/index.js'

import {InitialAndroidBuild} from './InitialAndroidBuild.js'

export const CreateInitialBuild = (props: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)
  return <>{gameId && <InitialAndroidBuild gameId={gameId} {...props} />}</>
}
