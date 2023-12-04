import { grid } from '../constants/dom'
import { width } from '../constants/generalConstants'
import { Ghost, createNewGhosts } from '../create-ghosts'
import { layout } from '../layout'

export type GameState = {
  squares: HTMLDivElement[]
  score: number
  hiscore: number
  livesLeft: number
  pacmanCurrentIndex: number
  pacmanCurrentDirection: number
  pacmanMovementClass: string
  dotsEaten: number
  ghostsEatenPoints: number
  firstBonusRemoved: boolean
  secondBonusRemoved: boolean
  isPaused: boolean
  isGameOver: boolean
  ghosts: Ghost[]
  getReadyTimer: number
  gameoverTimer: number
}

export const createSquares = () => {
  return layout.map((cell) => {
    const square = document.createElement('div')

    grid.appendChild(square)
    square.classList.add('cell', cell)

    if (cell === 'door') {
      square.classList.add('ghost-lair')
    }

    if (cell === 'bonus-sq') {
      square.classList.add('blank')
    }

    return square
  })
}

export const initializeState = (): GameState => {
  return {
    squares: createSquares(),
    score: 0,
    hiscore: 0,
    livesLeft: 2,
    pacmanCurrentIndex: 658,
    pacmanCurrentDirection: 1,
    pacmanMovementClass: 'pacman-facing-right',
    dotsEaten: 0,
    ghostsEatenPoints: 200,
    firstBonusRemoved: false,
    secondBonusRemoved: false,
    isPaused: true,
    isGameOver: true,
    ghosts: createNewGhosts(width),
    getReadyTimer: NaN,
    gameoverTimer: NaN,
  }
}
