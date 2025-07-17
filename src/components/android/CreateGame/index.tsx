import {Box} from 'ink'
import {useContext, useEffect, useState} from 'react'
import Spinner from 'ink-spinner'

import {createProject, updateProject} from '@cli/api/index.js'
import {DEFAULT_IGNORED_FILES_GLOBS, DEFAULT_SHIPPED_FILES_GLOBS} from '@cli/constants/config.js'
import {EditableProject, GameEngine, Project} from '@cli/types/api.js'
import {getGodotVersion} from '@cli/utils/godot.js'
import {CommandContext, GameContext} from '@cli/components/context/index.js'
import {StepProps} from '@cli/components/index.js'

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
    if (!command) throw new Error('No command')
    const flags = command.getDetailsFlagsValues()
    const config = command.getProjectConfigSafe()
    setShowForm(true)
    setIsLoading(false)
    const info = getGameInfo(flags, config.project)
    setGameInfo(info)
  }
  useEffect(() => {
    handleLoad().catch(props.onError)
  }, [])

  const handleSubmitForm = async (gameInfo: EditableProject) => {
    try {
      setShowForm(false)
      setIsLoading(true)

      if (!command) throw new Error('No command')
      const projectConfig = command.getProjectConfigSafe()
      const existingGame = projectConfig.project

      // If the game already exists, update the game info (set androidPackageName)
      const isNew = !existingGame
      if (!isNew) {
        const project = await updateProject(existingGame.id, gameInfo)
        const updatedConfig = {
          ...projectConfig,
          project,
        }
        await command.setProjectConfig(updatedConfig)
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
    } catch (e: any) {
      props.onError(e as Error)
    }
  }

  return (
    <Box flexDirection="column" gap={1} borderStyle="single" margin={1}>
      {isLoading && <Spinner />}
      {showForm && gameInfo && <GameInfoForm gameInfo={gameInfo} onSubmit={handleSubmitForm} />}
    </Box>
  )
}
