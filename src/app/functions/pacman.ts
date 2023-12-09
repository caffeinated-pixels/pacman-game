import {
  fruitEatenSound,
  ghostEatenSound,
  munchSound,
  powerPillSound,
} from '../constants/audioObjects'
import {
  pacmanHTML,
  pacmanStartIndex,
  width,
} from '../constants/generalConstants'
import { movePacman } from '../pacman-movement'
import { checkForLifeLost } from './gameOver'
import {
  frightenGhosts,
  returnGhostToLair,
  whichGhostWasEaten,
} from './ghostFrighten'
import { GameState } from './initializeState'
import { checkForLevelEnd } from './levelChecks'
import { updateScore } from './scoring'

export const drawPacman = (state: GameState) => {
  state.pacmanCurrentIndex = pacmanStartIndex
  state.pacmanMovementClass = 'pacman-facing-right'
  state.squares[state.pacmanCurrentIndex].classList.add(
    'pacman',
    state.pacmanMovementClass
  )
  state.squares[state.pacmanCurrentIndex].innerHTML = pacmanHTML
}

const removePacman = (pacmanCurrentTile: HTMLDivElement, state: GameState) => {
  pacmanCurrentTile.classList.remove('pacman', state.pacmanMovementClass)
  pacmanCurrentTile.innerHTML = ''
}

function didPacmanEatDot(state: GameState) {
  if (state.squares[state.pacmanCurrentIndex].classList.contains('pac-dot')) {
    state.squares[state.pacmanCurrentIndex].classList.remove('pac-dot')
    state.squares[state.pacmanCurrentIndex].classList.add('blank')
    state.dotsEaten++
    state.score += 10
    updateScore(state)
    munchSound.play()
  }
}

function didPacmanEatPowerPill(state: GameState) {
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
    frightenGhosts(state)
  }
}

function addBonusToBoard(state: GameState) {
  if (state.dotsEaten === 70 && !state.firstBonusRemoved) {
    state.squares[490].classList.add('bonus-cherry')
    setTimeout(() => removeFirstCherry(state), 10000)
  }

  if (state.dotsEaten === 170 && !state.secondBonusRemoved) {
    state.squares[490].classList.add('bonus-cherry')
    setTimeout(() => removeSecondCherry(state), 10000)
  }
}

function removeFirstCherry(state: GameState) {
  state.squares[490].classList.remove('bonus-cherry')
  state.firstBonusRemoved = true
}

function removeSecondCherry(state: GameState) {
  state.squares[490].classList.remove('bonus-cherry')
  state.secondBonusRemoved = true
}

function didPacmanEatBonus(state: GameState) {
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

function didPacmanEatGhost(state: GameState) {
  const pacmanCurrentSquare = state.squares[state.pacmanCurrentIndex]
  if (pacmanCurrentSquare.classList.contains('frightened-ghost')) {
    const ghost = whichGhostWasEaten(state, pacmanCurrentSquare)
    returnGhostToLair(state, ghost)
    ghostEatenSound.play()
  }
}

export const handleControlInput = (
  event: KeyboardEvent | Event,
  state: GameState
) => {
  if (state.isPaused) return
  const input =
    (event as KeyboardEvent).type === 'keydown'
      ? (event as KeyboardEvent).key
      : (event.currentTarget as HTMLElement)?.id

  const pacmanCurrentTile = state.squares[state.pacmanCurrentIndex]
  removePacman(pacmanCurrentTile, state)

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

  didPacmanEatGhost(state)
  didPacmanEatDot(state)
  didPacmanEatPowerPill(state)
  addBonusToBoard(state)
  didPacmanEatBonus(state)
  checkForLevelEnd(state)
  checkForLifeLost(state)
}
