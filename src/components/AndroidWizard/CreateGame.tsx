import {GameEngine} from '@cli/types/api.js'
import {RunWithSpinner} from '../RunWithSpinner.js'
import {StepProps} from './utils.js'
import {getGodotVersion} from '@cli/utils/godot.js'
import {createProject} from '@cli/api/index.js'

import {DEFAULT_IGNORED_FILES_GLOBS, DEFAULT_SHIPPED_FILES_GLOBS} from '@cli/constants/config.js'

export const CreateGame = (props: StepProps): JSX.Element => {
  const handleCreate = async () => {
    const gameInfo = props.gameInfo
    if (!gameInfo) throw new Error('No game info provided')

    const {name, details} = gameInfo

    const projectDetails = {
      ...details,
      gameEngine: GameEngine.GODOT,
      gameEngineVersion: getGodotVersion(),
    }

    const project = await createProject({name, details: projectDetails})

    await props.command.setProjectConfig({
      project,
      shippedFilesGlobs: DEFAULT_SHIPPED_FILES_GLOBS,
      ignoredFilesGlobs: DEFAULT_IGNORED_FILES_GLOBS,
    })
  }

  return (
    <RunWithSpinner
      executeMethod={handleCreate}
      msgInProgress="Creating game..."
      msgComplete="Game created!"
      onComplete={props.onComplete}
    />
  )
}
