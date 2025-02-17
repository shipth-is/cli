import React, {useEffect, useState} from 'react'

import {Project} from '@cli/types/api.js'
import {getProject} from '@cli/api/index.js'

import {CommandContext} from './CommandProvider.js'

export type GameContextType = {
  gameId: string | null
  game: Project | null
  setGameId: (gameId: string) => void
}

export const GameContext = React.createContext<GameContextType>({
  gameId: null,
  game: null,
  setGameId: (gameId: string) => {},
})

interface Props {
  children: React.ReactNode
}

export const GameProvider = ({children}: Props) => {
  const [gameId, setGameId] = useState<string | null>(null)
  const [game, setGame] = useState<Project | null>(null)

  const {command} = React.useContext(CommandContext)

  const handleLoad = async () => {
    if (command) {
      // Gives the id from the project config file or the --gameId flag
      const commandGameId = await command.getGameId()
      if (commandGameId) setGameId(commandGameId)
    }
  }

  const handleGameIdChange = async () => {
    if (!gameId) {
      setGame(null)
      return
    }
    const game = await getProject(gameId)
    setGame(game)
  }

  useEffect(() => {
    handleGameIdChange()
  }, [gameId])

  useEffect(() => {
    handleLoad()
  }, [command])

  return <GameContext.Provider value={{gameId, game, setGameId}}>{children}</GameContext.Provider>
}
