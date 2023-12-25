import {
  startGameSound,
  munchSound,
  fruitEatenSound,
  deathSound,
  ghostEatenSound,
  powerPillSound,
} from '../../constants/audioObjects'

const unlockAudioForiOS = () => {
  const audioToUnlock = [
    startGameSound,
    munchSound,
    fruitEatenSound,
    deathSound,
    ghostEatenSound,
    powerPillSound,
  ]

  audioToUnlock.forEach((audio) => {
    audio.play()
    audio.pause()
    audio.currentTime = 0
  })

  document.removeEventListener('touchstart', unlockAudioForiOS)
}

// fix for getting audio to play on iOS
export const initiateAudio = () => {
  document.addEventListener('touchstart', unlockAudioForiOS)
}
