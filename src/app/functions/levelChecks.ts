import { stopPowerPillSound } from '../constants/audioObjects'
import { grid } from '../constants/dom'
import { createBoard } from './createBoard'
import { removeAllGhosts, removePacman } from './gameOver'
import { GameState } from './initializeState'
import { getReadyTimer } from './stopStartGame'

export const checkForLevelEnd = (state: GameState) => {
  // default is >243
  if (state.dotsEaten > 243) {
    stopPowerPillSound()
    startNextLevel(state)
  }
}

function startNextLevel(state: GameState) {
  state.isPaused = true
  state.dotsEaten = 0
  state.ghostsEatenPoints = 200
  state.firstBonusRemoved = false
  state.secondBonusRemoved = false
  removeAllGhosts(state)

  const pacmanCurrentTile = state.squares[state.pacmanCurrentIndex]
  removePacman(state, pacmanCurrentTile)

  grid.innerHTML = ''
  createBoard(state)

  getReadyTimer(state)
}
