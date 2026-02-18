import {Box} from 'ink'
import {getMajorVersion} from 'godot-export-presets'

import {Markdown} from '@cli/components/index.js'
import {getGodotVersion, getGradleBuildOptionKey} from '@cli/utils/godot.js'

import {WEB_URL} from '@cli/constants/index.js'
import {useSafeInput} from '@cli/utils/index.js'

interface Props extends React.ComponentPropsWithoutRef<typeof Box> {
  onConfirm?: () => void
  onCancel?: () => void
}

export const EnableGradle = ({onConfirm, onCancel, ...boxProps}: Props) => {
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
            docsURL: `${WEB_URL}docs/guides/android-export-methods`,
            godotVersion,
            optionKey: getGradleBuildOptionKey(majorVersion),
          }}
        />
      </Box>
    </Box>
  )
}
