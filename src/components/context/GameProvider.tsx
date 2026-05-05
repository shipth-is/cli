import React, {useEffect, useState} from 'react'

import {getProject} from '@cli/api/index.js'
import {Project} from '@cli/types/api.js'

import {CommandContext} from './CommandProvider.js'

export type GameContextType = {
  game: Project | null
  gameId: null | string
  error: Error | null
  setGameId: (gameId: string) => void
}

export const GameContext = React.createContext<GameContextType>({
  game: null,
  gameId: null,
  error: null,
  setGameId(gameId: string) {},
})

interface Props {
  children: React.ReactNode
}

export const GameProvider = ({children}: Props) => {
  const {command} = React.useContext(CommandContext)
  const [gameId, setGameId] = useState<null | string>(command?.getGameId() || null)
  const [game, setGame] = useState<Project | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const handleGameIdChange = async () => {
    if (!gameId) {
      setGame(null)
      return
    }

    try {
      const game = await getProject(gameId)
      setGame(game)
      setError(null)
    } catch (err: any) {
      setError(err)
      setGame(null)
    }
  }

  useEffect(() => {
    handleGameIdChange()
  }, [gameId])

  return <GameContext.Provider value={{game, gameId, error, setGameId}}>{children}</GameContext.Provider>
}
