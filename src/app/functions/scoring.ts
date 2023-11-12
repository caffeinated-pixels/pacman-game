import { hiscoreDisplay, scoreDisplay } from '../constants/dom'
import { GameState } from './initializeState'

export const updateScore = (state: GameState) => {
  scoreDisplay.textContent = state.score.toString()
}

export const getHiscoreFromStorage = (state: GameState) => {
  if (localStorage.pacmanHiscore) {
    state.hiscore = localStorage.pacmanHiscore

    hiscoreDisplay.textContent = state.hiscore.toString()
  }
}

export const checkForHiscore = (state: GameState) => {
  if (state.score > state.hiscore) {
    state.hiscore = state.score
    hiscoreDisplay.textContent = state.hiscore.toString()
    localStorage.setItem('pacmanHiscore', state.hiscore.toString())
  }
}
