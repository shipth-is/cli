import {useContext, useEffect, useState} from 'react'
import {Box, Text} from 'ink'
import {getMajorVersion} from 'godot-export-presets'

import {GameContext, Markdown, StepProps} from '@cli/components/index.js'
import {
  getGodotVersion,
  getGradleBuildOptionKey,
  isGradleBuildEnabled,
  setGradleBuildEnabled,
} from '@cli/utils/godot.js'

import {InitialAndroidBuild} from './InitialAndroidBuild.js'
import {WEB_URL} from '@cli/constants/index.js'
import {useSafeInput} from '@cli/utils/index.js'

interface Props extends React.ComponentPropsWithoutRef<typeof Box> {
  onConfirm?: () => void
  onCancel?: () => void
}

const EnableGradle = ({onConfirm, onCancel, ...boxProps}: Props) => {
  const godotVersion = getGodotVersion()
  const majorVersion = getMajorVersion(godotVersion)

  useSafeInput(async (input) => {
    if (input == 'y') return onConfirm && onConfirm()
    if (input == 'n') return onCancel && onCancel()
  })

  return (
    <Box flexDirection="column" gap={1} {...boxProps}>
      <Box flexDirection="row" gap={1}>
        <Markdown
          filename="confirm-change-android-build-method.md.ejs"
          templateVars={{
            docsURL: `${WEB_URL}docs/guides/android-build-methods`,
            godotVersion,
            optionKey: getGradleBuildOptionKey(majorVersion),
          }}
        />
      </Box>
    </Box>
  )
}

export const CreateInitialBuild = ({onComplete, onError, ...boxProps}: StepProps): JSX.Element => {
  const {gameId} = useContext(GameContext)

  const [willBuildAAB, setWillBuildAAB] = useState<boolean | null>(null)

  useEffect(() => {
    // We can only build AABs if Gradle build is enabled
    async function fetchBuildMethod() {
      const isGradle = await isGradleBuildEnabled()
      setWillBuildAAB(isGradle)
    }
    fetchBuildMethod()
  }, [])

  const updateBuildMethod = async () => {
    await setGradleBuildEnabled(true)
    setWillBuildAAB(true)
  }

  if (willBuildAAB === null) {
    return <Text>Loading...</Text>
  }

  if (willBuildAAB === false) {
    return <EnableGradle onConfirm={() => updateBuildMethod()} onCancel={() => process.exit()} {...boxProps} />
  }

  return (
    <>{gameId && <InitialAndroidBuild gameId={gameId} onComplete={onComplete} onError={onError} {...boxProps} />}</>
  )
}
