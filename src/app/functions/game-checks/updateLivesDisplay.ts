import { livesLeftDisplay } from '../../constants/dom'
import { pacmanHTML } from '../../constants/generalConstants'
import { GameState } from '../game-setup/initializeState'

export const updateLivesDisplay = (state: GameState) => {
  livesLeftDisplay.innerHTML = ''

  for (let i = 0; i < state.livesLeft; i++) {
    const live = document.createElement('div')
    live.classList.add('life')
    live.innerHTML = pacmanHTML
    livesLeftDisplay.appendChild(live)
  }
}
