// TODO: sort imports
import { movePacman } from './pacman-movement'
import { grid, gameoverScreen, startButton, resetButton } from './constants/dom'
import { pacmanHTML, width } from './constants/generalConstants'
import {
  munchSound,
  fruitEatenSound,
  deathSound,
  ghostEatenSound,
  powerPillSound,
  stopPowerPillSound,
} from './constants/audioObjects'
import { createBoard } from './functions/createBoard'

import {
  checkForHiscore,
  getHiscoreFromStorage,
  updateScore,
} from './functions/scoring'
import { updateLivesDisplay } from './functions/display'

import {
  getReadyTimer,
  handleStartBtn,
  resetGame,
} from './functions/stopStartGame'

import { initializeGame } from './functions/initialize game'

document.addEventListener('keyup', handleControlInput)
startButton.addEventListener('click', () => handleStartBtn(state))
resetButton.addEventListener('click', () => resetGame(state))
document
  .querySelectorAll('.d-btn')
  .forEach((item) => item.addEventListener('click', handleControlInput))

const state = initializeGame()

/************************************************
GAME CONTROLS FUNCTIONS (START)
*************************************************/
function handleControlInput(event) {
  if (state.isPaused) return
  const input = event.type === 'keyup' ? event.key : event.currentTarget.id

  const pacmanCurrentTile = state.squares[state.pacmanCurrentIndex]
  removePacman(pacmanCurrentTile)

  switch (input) {
    case 'ArrowDown':
    case 'down':
    case 's':
      movePacman(state, width)
      break
    case 'ArrowUp':
    case 'up':
    case 'w':
      movePacman(state, -width)
      break
    case 'ArrowLeft':
    case 'left':
    case 'a':
      movePacman(state, -1)
      break
    case 'ArrowRight':
    case 'right':
    case 'd':
      movePacman(state, 1)
      break
  }

  state.squares[state.pacmanCurrentIndex].classList.add(
    'pacman',
    state.pacmanMovementClass
  )
  state.squares[state.pacmanCurrentIndex].innerHTML = pacmanHTML

  didPacmanEatGhost()
  didPacmanEatDot()
  didPacmanEatPowerPill()
  addBonusToBoard()
  didPacmanEatBonus()
  checkForLevelEnd()
  checkForLifeLost()
}

function removePacman(pacmanCurrentTile) {
  pacmanCurrentTile.classList.remove('pacman', state.pacmanMovementClass)
  pacmanCurrentTile.innerHTML = ''
}
/************************************************
GAME CONTROLS FUNCTIONS (END)
*************************************************/

/************************************************
PACMAN EATING FUNCTIONS (START)
*************************************************/
function didPacmanEatDot() {
  if (state.squares[state.pacmanCurrentIndex].classList.contains('pac-dot')) {
    state.squares[state.pacmanCurrentIndex].classList.remove('pac-dot')
    state.squares[state.pacmanCurrentIndex].classList.add('blank')
    state.dotsEaten++
    state.score += 10
    updateScore(state)
    munchSound.play()
  }
}

function didPacmanEatPowerPill() {
  if (
    state.squares[state.pacmanCurrentIndex].classList.contains('power-pill')
  ) {
    state.squares[state.pacmanCurrentIndex].classList.remove('power-pill')
    state.squares[state.pacmanCurrentIndex].classList.add('blank')

    state.score += 50
    state.dotsEaten++
    state.ghostsEatenPoints = 200
    powerPillSound.currentTime = 0
    powerPillSound.play()
    updateScore(state)
    frightenGhosts()
  }
}

function addBonusToBoard() {
  if (state.dotsEaten === 70 && !state.firstBonusRemoved) {
    state.squares[490].classList.add('bonus-cherry')
    setTimeout(removeFirstCherry, 10000)
  }

  if (state.dotsEaten === 170 && !state.secondBonusRemoved) {
    state.squares[490].classList.add('bonus-cherry')
    setTimeout(removeSecondCherry, 10000)
  }
}

function removeFirstCherry() {
  state.squares[490].classList.remove('bonus-cherry')
  state.firstBonusRemoved = true
}

function removeSecondCherry() {
  state.squares[490].classList.remove('bonus-cherry')
  state.secondBonusRemoved = true
}

function didPacmanEatBonus() {
  if (
    state.squares[state.pacmanCurrentIndex].classList.contains('bonus-cherry')
  ) {
    state.squares[state.pacmanCurrentIndex].classList.remove('bonus-cherry')
    state.score += 100
    updateScore(state)
    fruitEatenSound.play()

    if (!state.firstBonusRemoved) {
      state.firstBonusRemoved = true
    } else if (!state.secondBonusRemoved) {
      state.secondBonusRemoved = true
    }
  }
}

function didPacmanEatGhost() {
  const pacmanCurrentSquare = state.squares[state.pacmanCurrentIndex]
  if (pacmanCurrentSquare.classList.contains('frightened-ghost')) {
    const ghost = whichGhostWasEaten(pacmanCurrentSquare)
    returnGhostToLair(ghost)
    ghostEatenSound.play()
  }
}

function calcGhostEatenPoints() {
  state.score += state.ghostsEatenPoints
  state.ghostsEatenPoints *= 2
}
/************************************************
PACMAN EATING FUNCTIONS (END)
*************************************************/

/************************************************
SCORING/ENDPOINT FUNCTIONS (START)
*************************************************/
function checkForLifeLost() {
  const pacmanCurrentTile = state.squares[state.pacmanCurrentIndex]
  const didGhostGetPacman = pacmanCurrentTile.classList.contains('ghost')
  const isGhostFrightened =
    pacmanCurrentTile.classList.contains('frightened-ghost')

  if (didGhostGetPacman && !isGhostFrightened) {
    removeLife()
    removeAllGhosts()
    removePacman(pacmanCurrentTile)
    state.isPaused = true
    state.ghostsEatenPoints = 200
  }
}

function removeLife() {
  deathSound.play()
  stopPowerPillSound()

  if (state.livesLeft === 0) {
    gameOver()
  } else {
    state.livesLeft--
    updateLivesDisplay(state)
    getReadyTimer(state)
  }
}

function removeAllGhosts() {
  state.ghosts.forEach((ghost) => {
    clearInterval(ghost.timerId)
    resetGhostTimers(ghost)
    removeAllGhostClasses(ghost)
  })
}

function removeAllGhostClasses(ghost) {
  state.squares[ghost.currentIndex].classList.remove(
    ghost.className,
    'ghost',
    'frightened-ghost',
    'frightened-ghost-flash'
  )
}

function gameOver() {
  state.isGameOver = true
  gameoverScreen.style.display = 'block'
  checkForHiscore(state)

  state.gameoverTimer = setTimeout(resetGame, 2000)
}

function checkForLevelEnd() {
  // default is >243
  if (state.dotsEaten > 243) {
    stopPowerPillSound()
    startNextLevel()
  }
}

function startNextLevel() {
  state.isPaused = true
  state.dotsEaten = 0
  state.ghostsEatenPoints = 200
  state.firstBonusRemoved = false
  state.secondBonusRemoved = false
  removeAllGhosts()

  const pacmanCurrentTile = state.squares[state.pacmanCurrentIndex]
  removePacman(pacmanCurrentTile)

  grid.innerHTML = ''
  createBoard(state)

  getReadyTimer(state)
}
/************************************************
SCORING FUNCTIONS (END)
*************************************************/

/************************************************
FRIGHTEN & UNFRIGHTEN GHOST FUNCTIONS (START)
*************************************************/
function frightenGhosts() {
  state.ghosts.forEach((ghost) => {
    resetGhostTimers(ghost)

    if (!state.squares[ghost.currentIndex].classList.contains('ghost-lair')) {
      ghost.isFrightened = true
      ghost.firstMoveAfterFrightened = true
      state.squares[ghost.currentIndex].classList.add('frightened-ghost')

      ghost.flashTimerId = setTimeout(() => makeGhostFlash(ghost), 7000)
      ghost.frightenedTimer = setTimeout(unFrightenGhosts, 10000)
    }
  })
}

function unFrightenGhosts() {
  state.ghosts.forEach((ghost) => {
    ghost.isFrightened = false
    ghost.isFlashing = false
  })
  state.ghostsEatenPoints = 200
}

function makeGhostFlash(ghost) {
  if (ghost.isFrightened) {
    ghost.isFlashing = true
    state.squares[ghost.currentIndex].classList.add('frightened-ghost-flash')
  }
}

function resetGhostTimers(ghost) {
  // so that eating second pill while ghosts frightened resets timer
  clearTimeout(ghost.frightenedTimer)
  clearTimeout(ghost.flashTimerId)
  state.squares[ghost.currentIndex].classList.remove('frightened-ghost-flash')
  ghost.isFlashing = false
}

function whichGhostWasEaten(pacmanCurrentSquare) {
  if (pacmanCurrentSquare.classList.contains('blinky')) return state.ghosts[0]
  if (pacmanCurrentSquare.classList.contains('pinky')) return state.ghosts[1]
  if (pacmanCurrentSquare.classList.contains('inky')) return state.ghosts[2]
  if (pacmanCurrentSquare.classList.contains('clyde')) return state.ghosts[3]
}

function returnGhostToLair(ghost) {
  removeAllGhostClasses(ghost)
  resetGhostTimers(ghost)

  // change ghosts currentIndex back to its startIndex
  ghost.isFrightened = false
  ghost.currentIndex = ghost.respawnIndex
  ghost.currentDirection = -width

  // state.score += 200
  calcGhostEatenPoints()
  updateScore(state)
  // re-add classnames of ghost.className and 'ghost' to the ghosts new postion
  state.squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
}
/************************************************
FRIGHTEN & UNFRIGHTEN GHOST FUNCTIONS (END)
*************************************************/
