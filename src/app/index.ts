import { startButton, resetButton } from './constants/dom'

import { handleStartBtn, resetGame } from './functions/stopStartGame'

import { initializeGame } from './functions/initialize game'

import { handleControlInput } from './functions/pacman'
import { pacmanInterval } from './constants/generalConstants'

const state = initializeGame()

document.addEventListener('keydown', (e) => {
  if (!state.pacmanTimerId) {
    state.pacmanTimerId = setInterval(
      () => handleControlInput(e, state),
      pacmanInterval
    )
  }
})
document.addEventListener('keyup', () => {
  clearInterval(state.pacmanTimerId)
  state.pacmanTimerId = NaN
})

startButton.addEventListener('click', () => handleStartBtn(state))
resetButton.addEventListener('click', () => resetGame(state))
document
  .querySelectorAll('.d-btn')
  .forEach((item) =>
    item.addEventListener('click', (e) => handleControlInput(e, state))
  )
