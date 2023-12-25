import {
  ghostFrightenedInterval,
  ghostInterval,
  width,
} from '../../constants/generalConstants'
import { Ghost } from './create-ghosts'
import { removeAllGhostClasses } from '../game-checks/gameOver'
import { initGhostMovement } from './ghostLogic'
import { GameState } from '../game-setup/initializeState'
import { calcGhostEatenPoints, updateScore } from '../game-checks/scoring'

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
      ghost.frightenedTimer = setTimeout(() => unFrightenGhosts(state), 10000)
      ghost.speed = ghostFrightenedInterval
      initGhostMovement(state, ghost)
    }
  })
}

const unFrightenGhosts = (state: GameState) => {
  state.ghosts.forEach((ghost) => {
    ghost.isFrightened = false
    ghost.isFlashing = false
    ghost.speed = ghostInterval
    initGhostMovement(state, ghost)
  })
  state.ghostsEatenPoints = 200
}

export const whichGhostWasEaten = (
  state: GameState,
  pacmanCurrentSquare: HTMLDivElement
) => {
  if (pacmanCurrentSquare.classList.contains('blinky')) return state.ghosts[0]
  if (pacmanCurrentSquare.classList.contains('pinky')) return state.ghosts[1]
  if (pacmanCurrentSquare.classList.contains('inky')) return state.ghosts[2]
  return state.ghosts[3] // if (pacmanCurrentSquare.classList.contains('clyde'))
}

export const returnGhostToLair = (state: GameState, ghost: Ghost) => {
  removeAllGhostClasses(state, ghost)
  resetGhostTimers(state, ghost)

  // change ghosts currentIndex back to its startIndex
  ghost.isFrightened = false
  ghost.currentIndex = ghost.respawnIndex
  ghost.currentDirection = -width

  // state.score += 200
  calcGhostEatenPoints(state)
  updateScore(state)
  // re-add classnames of ghost.className and 'ghost' to the ghosts new postion
  state.squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
}
