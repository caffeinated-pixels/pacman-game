import { GameState } from './functions/initializeState'

type GhostClasses = 'blinky' | 'pinky' | 'inky' | 'clyde'

export type Ghost = {
  className: GhostClasses
  startIndex: number
  respawnIndex: number
  startTimer: number
  speed: number
  currentDirection: number
  scatterTarget: number
  currentIndex: number
  targetTile: number
  nextDirection: number
  isFrightened: boolean
  isFlashing: boolean
  firstMoveAfterFrightened: boolean
  timerId: number
  frightenedTimer: number
  flashTimerId: number
}

type CreateGhostParams = {
  className: GhostClasses
  startIndex: number
  respawnIndex: number
  startTimer: number
  speed: number
  currentDirection: number
  scatterTarget: number
}

const createGhost = ({
  className,
  startIndex,
  respawnIndex,
  startTimer,
  speed,
  currentDirection,
  scatterTarget,
}: CreateGhostParams) => {
  return {
    className,
    startIndex,
    respawnIndex,
    startTimer, // state.dotsEaten threshold
    speed,
    currentDirection,
    scatterTarget,
    currentIndex: startIndex,
    targetTile: 0,
    nextDirection: 0,
    isFrightened: false,
    isFlashing: false,
    firstMoveAfterFrightened: false,
    timerId: NaN,
    frightenedTimer: NaN,
    flashTimerId: NaN,
  }
}

export const createNewGhosts = (width: number): Ghost[] => {
  return [
    createGhost({
      className: 'blinky',
      startIndex: 321,
      respawnIndex: 377,
      startTimer: 0,
      speed: 350,
      currentDirection: -1,
      scatterTarget: -1,
    }),
    createGhost({
      className: 'pinky',
      startIndex: 378,
      respawnIndex: 378,
      startTimer: 5,
      speed: 350,
      currentDirection: -width,
      scatterTarget: -28,
    }),
    createGhost({
      className: 'inky',
      startIndex: 376,
      respawnIndex: 376,
      startTimer: 30,
      speed: 350,
      currentDirection: 1,
      scatterTarget: 895,
    }),
    createGhost({
      className: 'clyde',
      startIndex: 379,
      respawnIndex: 379,
      startTimer: 90,
      speed: 350,
      currentDirection: -1,
      scatterTarget: 868,
    }),
  ]

  // return [new Ghost('clyde', 379, 379, 0, 500, -1, 868)]
  // return [new Ghost('blinky', 321, 377, 0, 1000, -1, -1)]
  // return [new Ghost('blinky', 394, 377, 0, 1000, -1, -1)]
  // return [new Ghost('blinky', 417, 377, 0, 1000, 1, -1)]
}

export const drawGhosts = (state: GameState) => {
  state.ghosts.forEach((ghost: Ghost) => {
    state.squares[ghost.currentIndex].classList.add(ghost.className)
    state.squares[ghost.currentIndex].classList.add('ghost')
  })
}
