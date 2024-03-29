import { deathSound, stopPowerPillSound } from '../../constants/audioObjects'
import { gameoverScreen } from '../../constants/dom'
import { Ghost } from '../ghosts/create-ghosts'
import { updateLivesDisplay } from './updateLivesDisplay'
import { resetGhostTimers } from '../ghosts/ghostLogic'
import { GameState } from '../game-setup/initializeState'
import { checkForHiscore } from './scoring'
import { getReadyTimer, resetGame } from '../game-setup/stopStartGame'

const gameOver = (state: GameState) => {
  state.isGameOver = true
  gameoverScreen.style.display = 'block'
  checkForHiscore(state)

  state.gameoverTimer = setTimeout(() => resetGame(state), 2000)
}

const removeLife = (state: GameState) => {
  deathSound.play()
  stopPowerPillSound()

  if (state.livesLeft === 0) {
    gameOver(state)
  } else {
    state.livesLeft--
    updateLivesDisplay(state)
    getReadyTimer(state)
  }
}

export const removeAllGhostClasses = (state: GameState, ghost: Ghost) => {
  state.squares[ghost.currentIndex].classList.remove(
    ghost.className,
    'ghost',
    'frightened-ghost',
    'frightened-ghost-flash'
  )
}

export const removeAllGhosts = (state: GameState) => {
  state.ghosts.forEach((ghost) => {
    clearInterval(ghost.timerId)
    resetGhostTimers(state, ghost)
    removeAllGhostClasses(state, ghost)
  })
}

export const removePacman = (
  state: GameState,
  pacmanCurrentTile: HTMLElement
) => {
  pacmanCurrentTile.classList.remove('pacman', state.pacmanMovementClass)
  pacmanCurrentTile.innerHTML = ''
}

export const checkForLifeLost = (state: GameState) => {
  const pacmanCurrentTile = state.squares[state.pacmanCurrentIndex]
  const didGhostGetPacman = pacmanCurrentTile.classList.contains('ghost')
  const isGhostFrightened =
    pacmanCurrentTile.classList.contains('frightened-ghost')

  if (didGhostGetPacman && !isGhostFrightened) {
    clearInterval(state.pacmanTimerId)
    removeLife(state)
    removeAllGhosts(state)
    removePacman(state, pacmanCurrentTile)
    state.isPaused = true
    state.ghostsEatenPoints = 200
  }
}
