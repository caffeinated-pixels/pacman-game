import {
  startGameSound,
  munchSound,
  fruitEatenSound,
  deathSound,
  ghostEatenSound,
  powerPillSound,
} from '../../constants/audioObjects'

// fix for getting audio to play on iOS
export const initiateAudio = () => {
  const audioToUnlock = [
    startGameSound,
    munchSound,
    fruitEatenSound,
    deathSound,
    ghostEatenSound,
    powerPillSound,
  ]
  document.addEventListener('touchstart', unlockAudioForiOS)

  function unlockAudioForiOS() {
    audioToUnlock.forEach((audio) => {
      audio.play()
      audio.pause()
      audio.currentTime = 0
    })

    document.removeEventListener('touchstart', unlockAudioForiOS)
  }
}
