import { startGameSound, stopPowerPillSound } from '../constants/audioObjects'
import {
  gameoverScreen,
  getReadyScreen,
  grid,
  pauseScreen,
  startButton,
  startScreen,
} from '../constants/dom'
import { pauseIcon, playIcon, width } from '../constants/generalConstants'
import { createNewGhosts, drawGhosts } from '../create-ghosts'
import { createBoard } from './createBoard'
import { initGhostMovement } from './ghostLogic'
import { GameState, createSquares } from './initializeState'
import { drawPacman, handleControlInput } from './pacman'
import { updateScore } from './scoring'

const resumeGame = (state: GameState) => {
  state.isPaused = false
  startButton.innerHTML = pauseIcon
  pauseScreen.style.display = 'none'
  state.ghosts.forEach((ghost) => initGhostMovement(state, ghost))
}

export const getReadyTimer = (state: GameState) => {
  startScreen.style.display = 'none'
  getReadyScreen.style.display = 'block'

  state.getReadyTimer = setTimeout(() => startGame(state), 1500)
}

const pauseGame = (state: GameState) => {
  state.isPaused = true
  startButton.innerHTML = playIcon
  pauseScreen.style.display = 'block'
  state.ghosts.forEach((ghost) => clearInterval(ghost.timerId))
}

export const handleStartBtn = (state: GameState) => {
  if (state.isGameOver) {
    startGameSound.play()
    getReadyTimer(state)
  } else if (state.isPaused) {
    resumeGame(state)
  } else if (!state.isPaused) {
    pauseGame(state)
  }
}

const startGame = (state: GameState) => {
  startButton.innerHTML = pauseIcon
  getReadyScreen.style.display = 'none'

  drawPacman(state)

  // TODO: only need to create ghosts on new level, not on game start
  state.ghosts = createNewGhosts(width)
  drawGhosts(state)
  state.ghosts.forEach((ghost) => initGhostMovement(state, ghost))

  state.isGameOver = false
  state.isPaused = false

  // automatically start pacman moving left
  const fakeEvent = { type: 'keydown', key: 'a' } as KeyboardEvent
  handleControlInput(fakeEvent, state)
  // state.pacmanTimerId = setInterval(
  //   () => handleControlInput(fakeEvent, state),
  //   pacmanInterval
  // )
}

export const resetGame = (state: GameState) => {
  state.ghosts.forEach((ghost) => {
    clearInterval(ghost.timerId)
    clearTimeout(ghost.flashTimerId)
  })
  clearInterval(state.pacmanTimerId)

  startScreen.style.display = 'block'
  pauseScreen.style.display = 'none'
  getReadyScreen.style.display = 'none'
  gameoverScreen.style.display = 'none'
  clearTimeout(state.getReadyTimer)
  clearTimeout(state.gameoverTimer)

  state.isPaused = true
  state.isGameOver = true
  state.score = 0
  state.livesLeft = 2
  state.dotsEaten = 0
  state.ghostsEatenPoints = 200
  state.firstBonusRemoved = false
  state.secondBonusRemoved = false
  grid.innerHTML = ''
  startButton.innerHTML = playIcon
  state.ghosts = createNewGhosts(width)

  stopPowerPillSound()
  updateScore(state)
  state.squares = createSquares()
  createBoard(state)
}
