// TODO: sort imports
import { movePacman } from './pacman-movement'
import { grid, gameoverScreen, startButton, resetButton } from './constants/dom'
import { pacmanHTML, width } from './constants/generalConstants'
import {
  munchSound,
  fruitEatenSound,
  deathSound,
  ghostEatenSound,
  powerPillSound,
  stopPowerPillSound,
} from './constants/audioObjects'
import { createBoard } from './functions/createBoard'

import {
  checkForHiscore,
  getHiscoreFromStorage,
  updateScore,
} from './functions/scoring'
import { updateLivesDisplay } from './functions/display'

import {
  getReadyTimer,
  handleStartBtn,
  resetGame,
} from './functions/stopStartGame'

import { initializeGame } from './functions/initialize game'
import { resetGhostTimers } from './functions/ghostLogic'
import { frightenGhosts, whichGhostWasEaten } from './functions/ghostFrighten'
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
