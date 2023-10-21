import { hiscoreDisplay } from '../constants/dom'
import { GameState } from './initializeState'

export const getHiscoreFromStorage = (state: GameState) => {
  console.log('🚀 turbo ~ getHiscoreFromStorage ~ state:', state)

  if (localStorage.pacmanHiscore) {
    console.log(
      '🚀 turbo ~ getHiscoreFromStorage ~ localStorage.pacmanHiscore:',
      localStorage.pacmanHiscore
    )
    state.hiscore = localStorage.pacmanHiscore

    hiscoreDisplay.textContent = state.hiscore.toString()
  }

  console.log('🚀 turbo ~ getHiscoreFromStorage ~ state:', state)
}

export const checkForHiscore = (state: GameState) => {
  if (state.score > state.hiscore) {
    state.hiscore = state.score
    hiscoreDisplay.textContent = state.hiscore.toString()
    localStorage.setItem('pacmanHiscore', state.hiscore.toString())
  }
}
