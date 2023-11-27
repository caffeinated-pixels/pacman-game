import { Ghost } from '../create-ghosts'
import { GameState } from './initializeState'

const resetGhostTimers = (state: GameState, ghost: Ghost) => {
  // so that eating second pill while ghosts frightened resets timer
  clearTimeout(ghost.frightenedTimer)
  clearTimeout(ghost.flashTimerId)
  state.squares[ghost.currentIndex].classList.remove('frightened-ghost-flash')
  ghost.isFlashing = false
}

const makeGhostFlash = (state: GameState, ghost: Ghost) => {
  if (ghost.isFrightened) {
    ghost.isFlashing = true
    state.squares[ghost.currentIndex].classList.add('frightened-ghost-flash')
  }
}

export const frightenGhosts = (state: GameState) => {
  state.ghosts.forEach((ghost) => {
    resetGhostTimers(state, ghost)

    if (!state.squares[ghost.currentIndex].classList.contains('ghost-lair')) {
      ghost.isFrightened = true
      ghost.firstMoveAfterFrightened = true
      state.squares[ghost.currentIndex].classList.add('frightened-ghost')

      ghost.flashTimerId = setTimeout(() => makeGhostFlash(state, ghost), 7000)
      ghost.frightenedTimer = setTimeout(unFrightenGhosts, 10000)
    }
  })
}

function unFrightenGhosts(state: GameState) {
  state.ghosts.forEach((ghost) => {
    ghost.isFrightened = false
    ghost.isFlashing = false
  })
  state.ghostsEatenPoints = 200
}
