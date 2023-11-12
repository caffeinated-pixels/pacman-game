import { ghostDirections } from '../constants/generalConstants'
import { Ghost } from '../create-ghosts'
import { checkForLifeLost } from './gameOver'
import { getTargetTileDistance } from './getCoords'
import { setGhostTarget } from './ghostTargeting'
import { GameState } from './initializeState'

const isGhostFrightened = (state: GameState, ghost: Ghost) => {
  if (ghost.isFrightened) {
    state.squares[ghost.currentIndex].classList.add('frightened-ghost')
  }

  if (ghost.isFlashing) {
    state.squares[ghost.currentIndex].classList.add('frightened-ghost-flash')
  }
}

const isDirectionLegal = (state: GameState, tileIndex: number) => {
  return (
    !state.squares[tileIndex].classList.contains('wall') &&
    !state.squares[tileIndex].classList.contains('ghost-lair')
  )
}

const getRandomDirection = (state: GameState, ghost: Ghost) => {
  // if randomDirection not legal, ghost chooses next legal direction in order of up, left, down, right (same as order in ghostDirections arr)
  const randomIndex = Math.floor(Math.random() * ghostDirections.length)
  const randomDirection = ghostDirections[randomIndex]

  const isNotReverseDirection = randomDirection !== -ghost.currentDirection

  const nextTile = ghost.currentIndex + ghost.currentDirection

  const directionOption = randomDirection + nextTile

  if (isDirectionLegal(state, directionOption) && isNotReverseDirection) {
    return randomDirection
  }

  const remainingDirections = ghostDirections.filter((direction) => {
    const directionOption = direction + nextTile

    if (direction === randomDirection) return false
    if (direction === -ghost.currentDirection) return false
    return isDirectionLegal(state, directionOption)
  })

  return remainingDirections[0]
}

const firstDirectionAfterFrightened = (state: GameState, ghost: Ghost) => {
  const reverseTile = ghost.currentIndex + -ghost.currentDirection
  ghost.firstMoveAfterFrightened = false

  if (isDirectionLegal(state, reverseTile)) {
    return -ghost.currentDirection
  } else {
    return getRandomDirection(state, ghost)
  }
}

const getFrightenedGhostDirection = (state: GameState, ghost: Ghost) => {
  // after first becoming frightened, ghost will attempt to reverse direction (if legal)
  // otherwise we choose a random direction
  if (ghost.firstMoveAfterFrightened) {
    return firstDirectionAfterFrightened(state, ghost)
  } else {
    return getRandomDirection(state, ghost)
  }
}

const getLegalGhostDirections = (
  state: GameState,
  nextTile: number,
  ghost: Ghost
) => {
  return ghostDirections.filter((direction) => {
    const tileIndex = nextTile + direction

    if (direction === -ghost.currentDirection) return false
    if (
      state.squares[ghost.currentIndex].classList.contains('ghost-lair') &&
      state.squares[tileIndex].classList.contains('ghost-lair')
    ) {
      return true
    }

    return isDirectionLegal(state, tileIndex)
  })
}

const getNextGhostDirection = (state: GameState, ghost: Ghost) => {
  // ghost plans movement one tile ahead, so we check nextTile for legal direction options
  // cannot reverse direction, return to lair, or move into wall
  const nextTile = ghost.currentIndex + ghost.currentDirection
  // console.log('currentIndex = ' + ghost.currentIndex)
  // console.log('currentDirection = ' + ghost.currentDirection)
  // console.log('nextTile = ' + nextTile)

  // if (nextTile === 392) {
  //   ghost.nextDirection = -1
  // } else if (nextTile === 419) {
  //   ghost.nextDirection = 1
  // } else {
  const legalDirections = getLegalGhostDirections(state, nextTile, ghost)

  if (legalDirections.length > 1) {
    return getTargetTileDistance(legalDirections, nextTile, ghost)
  } else {
    return legalDirections[0]
  }
  // }
}

const moveGhost = (state: GameState, ghost: Ghost) => {
  if (ghost.isFrightened) {
    ghost.nextDirection = getFrightenedGhostDirection(state, ghost)
  } else {
    setGhostTarget(state, ghost)
    ghost.nextDirection = getNextGhostDirection(state, ghost)
  }

  state.squares[ghost.currentIndex].classList.remove(ghost.className)
  state.squares[ghost.currentIndex].classList.remove(
    'ghost',
    'frightened-ghost',
    'frightened-ghost-flash'
  )

  ghost.currentIndex += ghost.currentDirection

  //  override for ghost tunnel movement
  if (ghost.currentIndex === 392) {
    ghost.currentIndex = 419
    ghost.nextDirection = -1
  } else if (ghost.currentIndex === 419) {
    ghost.currentIndex = 392
    ghost.nextDirection = 1
  }

  state.squares[ghost.currentIndex].classList.add(ghost.className)
  state.squares[ghost.currentIndex].classList.add('ghost')

  ghost.currentDirection = ghost.nextDirection
}

export const initGhostMovement = (state: GameState, ghost: Ghost) => {
  ghost.timerId = setInterval(function () {
    // each ghost has dotsEaten threshold for leaving lair
    if (state.dotsEaten >= ghost.startTimer) {
      moveGhost(state, ghost)
      isGhostFrightened(state, ghost)
      // checkForGameOver()
      checkForLifeLost(state)
    }
  }, ghost.speed)
}

export const resetGhostTimers = (state: GameState, ghost: Ghost) => {
  // so that eating second pill while ghosts frightened resets timer
  clearTimeout(ghost.frightenedTimer)
  clearTimeout(ghost.flashTimerId)
  state.squares[ghost.currentIndex].classList.remove('frightened-ghost-flash')
  ghost.isFlashing = false
}
