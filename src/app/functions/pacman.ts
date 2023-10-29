import { pacmanHTML, pacmanStartIndex } from '../constants/generalConstants'
import { GameState } from './initializeState'

export const drawPacman = (state: GameState) => {
  state.pacmanCurrentIndex = pacmanStartIndex
  state.pacmanMovementClass = 'pacman-facing-right'
  state.squares[state.pacmanCurrentIndex].classList.add(
    'pacman',
    state.pacmanMovementClass
  )
  state.squares[state.pacmanCurrentIndex].innerHTML = pacmanHTML
}
