import React, {useEffect, useState} from 'react'

import {Project} from '@cli/types/api.js'
import {CommandContext} from './CommandProvider.js'
import {getProject} from '@cli/api/index.js'

export type GameContextType = {
  gameId: string | null
  game: Project | null
  setGameId: (gameId: string) => void
  setGame: (game: Project) => void
}

export const GameContext = React.createContext<GameContextType>({
  gameId: null,
  game: null,
  setGameId: (gameId: string) => {},
  setGame: (game: Project) => {},
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
      const gameId = await command.getGameId()
      setGameId(gameId)
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

  return <GameContext.Provider value={{gameId, game, setGameId, setGame}}>{children}</GameContext.Provider>
}
