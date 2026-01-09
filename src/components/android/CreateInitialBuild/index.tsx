import {useContext, useEffect, useState} from 'react'
import {Text} from 'ink'

import {GameContext, StepProps} from '@cli/components/index.js'
import {isGradleBuildEnabled, setGradleBuildEnabled} from '@cli/utils/godot.js'

import {InitialAndroidBuild} from './InitialAndroidBuild.js'
import {EnableGradle} from './EnableGradle.js'

export const CreateInitialBuild = ({onComplete, onError, ...boxProps}: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)
  const [canBuildAAB, setCanBuildAAB] = useState<boolean | null>(null)

  useEffect(() => {
    // We can only build AABs if Gradle build is enabled
    async function fetchBuildMethod() {
      const isGradle = await isGradleBuildEnabled()
      setCanBuildAAB(isGradle)
    }
    fetchBuildMethod()
  }, [])

  const updateBuildMethod = async () => {
    await setGradleBuildEnabled(true)
    setCanBuildAAB(true)
  }

  if (canBuildAAB === null) {
    return <Text>Loading...</Text>
  }

  if (canBuildAAB === false) {
    return <EnableGradle {...boxProps} onConfirm={() => updateBuildMethod()} onCancel={() => process.exit()} />
  }

  return (
    <>{gameId && <InitialAndroidBuild gameId={gameId} onComplete={onComplete} onError={onError} {...boxProps} />}</>
  )
}
