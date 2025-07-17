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
  const {command} = React.useContext(CommandContext)
  const [gameId, setGameId] = useState<string | null>(command?.getGameId() || null)
  const [game, setGame] = useState<Project | null>(null)

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

  return <GameContext.Provider value={{gameId, game, setGameId}}>{children}</GameContext.Provider>
}
