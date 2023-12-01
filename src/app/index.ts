import { startButton, resetButton } from './constants/dom'

import { handleStartBtn, resetGame } from './functions/stopStartGame'

import { initializeGame } from './functions/initialize game'

import { handleControlInput } from './functions/pacman'

const state = initializeGame()

document.addEventListener('keyup', (e) => handleControlInput(e, state))
startButton.addEventListener('click', () => handleStartBtn(state))
resetButton.addEventListener('click', () => resetGame(state))
document
  .querySelectorAll('.d-btn')
  .forEach((item) =>
    item.addEventListener('click', (e) => handleControlInput(e, state))
  )
