import React, {useEffect, useState} from 'react'

import {getProject} from '@cli/api/index.js'
import {Project} from '@cli/types/api.js'

import {CommandContext} from './CommandProvider.js'

export type GameContextType = {
  game: Project | null
  gameId: null | string
  setGameId: (gameId: string) => void
}

export const GameContext = React.createContext<GameContextType>({
  game: null,
  gameId: null,
  setGameId(gameId: string) {},
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

  return <GameContext.Provider value={{game, gameId, setGameId}}>{children}</GameContext.Provider>
}
