import { createBoard } from './createBoard'
import { updateLivesDisplay } from './display'
import { initializeState } from './initializeState'
import { initiateAudio } from './initiateAudio'
import { drawPacman } from './pacman'
import { getHiscoreFromStorage } from './scoring'

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
