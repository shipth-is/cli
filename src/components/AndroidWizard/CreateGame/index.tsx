import {Box} from 'ink'
import {useContext, useEffect, useState} from 'react'
import Spinner from 'ink-spinner'

import {BaseGameCommand} from '@cli/baseCommands/index.js'
import {createProject} from '@cli/api/index.js'
import {DEFAULT_IGNORED_FILES_GLOBS, DEFAULT_SHIPPED_FILES_GLOBS} from '@cli/constants/config.js'
import {EditableProject, GameEngine, Project} from '@cli/types/api.js'
import {getGodotVersion} from '@cli/utils/godot.js'
import {CommandContext, GameContext} from '@cli/components/context/index.js'

import {StepProps} from '../utils.js'
import {GameInfoForm} from './GameInfoForm.js'

// Merges the flag values and the project details (if set)
const getGameInfo = (flagValues: Record<string, string>, project?: Project) => {
  const androidPackageName = flagValues.androidPackageName || project?.details?.androidPackageName || ''
  const gameInfo: EditableProject = {
    name: project?.name || flagValues.name || '',
    details: {
      ...project?.details,
      androidPackageName,
    },
  }
  return gameInfo
}

// This step creates the game if it does not exist.
// It also makes sure the androidPackageName is set, even if the game exists
export const CreateGame = (props: StepProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true)
  const [gameInfo, setGameInfo] = useState<EditableProject | null>(null)
  const [showForm, setShowForm] = useState(false)
  const {command} = useContext(CommandContext)
  const {setGameId, game} = useContext(GameContext)

  // Populate the form with the game info (if game already exists)
  const handleLoad = async () => {
    if (!command) return
    const flagValues = command.getDetailsFlagsValues()
    const projectConfig = await command.getProjectConfigSafe()
    if (!projectConfig.project) {
      setShowForm(true)
      setIsLoading(false)
      const gameInfo = getGameInfo(flagValues)
      setGameInfo(gameInfo)
      return
    }
    const gameInfo = getGameInfo(flagValues, game || undefined)
    setGameInfo(gameInfo)
    setShowForm(true)
    setIsLoading(false)
  }

  useEffect(() => {
    handleLoad()
  }, [])

  const handleGameInfoSubmit = async (gameInfo: EditableProject) => {
    if (!command) return
    // TODO: error handling and props.onError
    setShowForm(false)
    setIsLoading(true)

    const isNew = !(await command.getProjectConfigSafe()).project

    // If the game already exists, update the game info (set androidPackageName)
    if (!isNew) {
      // TODO
      const cmd = command as BaseGameCommand<any>
      await cmd.updateGame(gameInfo)
      return props.onComplete()
    }

    const {name, details} = gameInfo
    const projectDetails = {
      ...details,
      gameEngine: GameEngine.GODOT,
      gameEngineVersion: getGodotVersion(),
    }
    const project = await createProject({name, details: projectDetails})
    await command.setProjectConfig({
      project,
      shippedFilesGlobs: DEFAULT_SHIPPED_FILES_GLOBS,
      ignoredFilesGlobs: DEFAULT_IGNORED_FILES_GLOBS,
    })

    // Update the context value for the other components in the wizard
    setGameId(project.id)
    props.onComplete()
  }

  return (
    <Box flexDirection="column" gap={1} borderStyle="single" margin={1}>
      {isLoading && <Spinner />}
      {showForm && gameInfo && <GameInfoForm gameInfo={gameInfo} onSubmit={handleGameInfoSubmit} />}
    </Box>
  )
}
