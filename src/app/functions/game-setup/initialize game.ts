import { createBoard } from './createBoard'
import { updateLivesDisplay } from '../game-checks/updateLivesDisplay'
import { initializeState } from './initializeState'
import { initiateAudio } from './initiateAudio'
import { drawPacman } from '../pac-man/pacman'
import { getHiscoreFromStorage } from '../game-checks/scoring'

export const initializeGame = () => {
  // fix for getting audio to play on iOS
  initiateAudio()

  const state = initializeState()
  createBoard(state)
  getHiscoreFromStorage(state)

  updateLivesDisplay(state)

  drawPacman(state)

  return state
}
