import { startButton, resetButton } from './constants/dom'

import { handleStartBtn, resetGame } from './functions/game-setup/stopStartGame'

import { initializeGame } from './functions/game-setup/initialize game'

import { handleControlInput } from './functions/pac-man/pacman'

const state = initializeGame()

document.addEventListener('keydown', (e) => {
  if (state.isPaused) return
  handleControlInput(e, state)
})

startButton.addEventListener('click', () => handleStartBtn(state))
resetButton.addEventListener('click', () => resetGame(state))
document
  .querySelectorAll('.d-btn')
  .forEach((item) =>
    item.addEventListener('click', (e) => handleControlInput(e, state))
  )
