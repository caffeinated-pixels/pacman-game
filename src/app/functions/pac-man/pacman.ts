import {
  fruitEatenSound,
  ghostEatenSound,
  munchSound,
  powerPillSound,
} from '../../constants/audioObjects'
import {
  pacmanHTML,
  pacmanInterval,
  pacmanStartIndex,
  width,
} from '../../constants/generalConstants'
import { checkForLifeLost } from '../game-checks/gameOver'
import {
  frightenGhosts,
  returnGhostToLair,
  whichGhostWasEaten,
} from '../ghosts/ghostFrighten'
import { GameState } from '../game-setup/initializeState'
import { checkForLevelEnd } from '../game-checks/levelChecks'
import { updateScore } from '../game-checks/scoring'

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

const didPacmanEatDot = (state: GameState) => {
  if (state.squares[state.pacmanCurrentIndex].classList.contains('pac-dot')) {
    state.squares[state.pacmanCurrentIndex].classList.remove('pac-dot')
    state.squares[state.pacmanCurrentIndex].classList.add('blank')
    state.dotsEaten++
    state.score += 10
    updateScore(state)
    munchSound.play()
  }
}

const didPacmanEatPowerPill = (state: GameState) => {
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

const addBonusToBoard = (state: GameState) => {
  if (state.dotsEaten === 70 && !state.firstBonusRemoved) {
    state.squares[490].classList.add('bonus-cherry')
    setTimeout(() => removeFirstCherry(state), 10000)
  }

  if (state.dotsEaten === 170 && !state.secondBonusRemoved) {
    state.squares[490].classList.add('bonus-cherry')
    setTimeout(() => removeSecondCherry(state), 10000)
  }
}

const removeFirstCherry = (state: GameState) => {
  state.squares[490].classList.remove('bonus-cherry')
  state.firstBonusRemoved = true
}

const removeSecondCherry = (state: GameState) => {
  state.squares[490].classList.remove('bonus-cherry')
  state.secondBonusRemoved = true
}

const didPacmanEatBonus = (state: GameState) => {
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

const didPacmanEatGhost = (state: GameState) => {
  const pacmanCurrentSquare = state.squares[state.pacmanCurrentIndex]
  if (pacmanCurrentSquare.classList.contains('frightened-ghost')) {
    const ghost = whichGhostWasEaten(state, pacmanCurrentSquare)
    returnGhostToLair(state, ghost)
    ghostEatenSound.play()
  }
}

const getRequestedDirection = (state: GameState, input: string) => {
  switch (input) {
    case 'ArrowDown':
    case 'down':
    case 's':
      return width
    case 'ArrowUp':
    case 'up':
    case 'w':
      return -width
    case 'ArrowLeft':
    case 'left':
    case 'a':
      return -1
    case 'ArrowRight':
    case 'right':
    case 'd':
      return 1

    default:
      return state.pacmanCurrentDirection
  }
}

const checkForWall = (state: GameState, requestedIndex: number) => {
  return (
    state.squares[requestedIndex].classList.contains('wall') ||
    state.squares[requestedIndex].classList.contains('ghost-lair')
  )
}

const movePacman = (state: GameState, direction: number) => {
  if (state.isPaused) return

  const requestedIndex = state.pacmanCurrentIndex + direction
  if (checkForWall(state, requestedIndex)) return

  /**
   * check before and after pacman moves to see if he ate a frightened ghost
   */
  didPacmanEatGhost(state)

  const pacmanCurrentTile = state.squares[state.pacmanCurrentIndex]
  removePacman(pacmanCurrentTile, state)

  state.pacmanCurrentIndex = requestedIndex
  state.pacmanCurrentDirection = direction
  switch (direction) {
    case 1:
      state.pacmanMovementClass = 'pacman-facing-right'
      break
    case -1:
      state.pacmanMovementClass = 'pacman-facing-left'
      break
    case 28:
      state.pacmanMovementClass = 'pacman-facing-down'
      break
    case -28:
      state.pacmanMovementClass = 'pacman-facing-up'
      break
  }

  if (state.pacmanCurrentIndex === 392) {
    state.pacmanCurrentIndex = 419
  } else if (state.pacmanCurrentIndex === 419) {
    state.pacmanCurrentIndex = 392
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

export const handleControlInput = (
  event: KeyboardEvent | Event,
  state: GameState
) => {
  const input =
    (event as KeyboardEvent).type === 'keydown'
      ? (event as KeyboardEvent).key
      : (event.currentTarget as HTMLElement)?.id

  const requestedDirection = getRequestedDirection(state, input)
  const requestedIndex = state.pacmanCurrentIndex + requestedDirection

  if (checkForWall(state, requestedIndex)) return
  // prevent spamming of movement keys to speed up pacman
  if (requestedDirection === state.pacmanCurrentDirection) return

  clearInterval(state.pacmanTimerId)

  movePacman(state, requestedDirection)

  state.pacmanTimerId = setInterval(
    () => movePacman(state, requestedDirection),
    pacmanInterval
  )
}
