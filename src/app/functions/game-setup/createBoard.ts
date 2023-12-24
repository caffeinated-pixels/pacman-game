import { width, height, pacmanHTML } from '../../constants/generalConstants'
import { livesLeftDisplay } from '../../constants/dom'
import { GameState } from './initializeState'

const addWallborders = (state: GameState) => {
  state.squares.forEach((square, i, arr) => {
    // checking for wall exterior sides
    const isAtTopEdge = i - width < 0
    const isAtRightEdge = i % width === width - 1
    const isAtBottomEdge = i + width >= width * height
    const isAtLeftEdge = i % width === 0

    // check for wall internal sides
    const isTopSide =
      i - width > 28 && !arr[i - width].classList.contains('wall')

    const isRightSide = i + 1 < 867 && !arr[i + 1].classList.contains('wall')

    const isBottomSide =
      i + width < width * 30 && !arr[i + width].classList.contains('wall')

    const isLeftSide = i - 1 > 0 && !arr[i - 1].classList.contains('wall')

    // add wall border classes
    if (square.classList.contains('wall')) {
      if (isAtTopEdge || isTopSide) {
        square.classList.add('border-top')
      }
      if (isAtRightEdge || isRightSide) {
        square.classList.add('border-right')
      }
      if (isAtBottomEdge || isBottomSide) {
        square.classList.add('border-bottom')
      }
      if (isAtLeftEdge || isLeftSide) square.classList.add('border-left')
    }
  })
}

const updateLivesDisplay = (state: GameState) => {
  livesLeftDisplay.innerHTML = ''

  for (let i = 0; i < state.livesLeft; i++) {
    const live = document.createElement('div')
    live.classList.add('life')
    live.innerHTML = pacmanHTML
    livesLeftDisplay.appendChild(live)
  }
}

export const createBoard = (state: GameState) => {
  addWallborders(state)
  updateLivesDisplay(state)
}
