import { grid } from '../constants/dom'
import { layout } from '../layout'

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

export const initializeState = () => {
  // TODO: fix never type for ghosts
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
    ghosts: [],
    getReadyTimer: NaN,
    gameoverTimer: NaN,
  }
}
