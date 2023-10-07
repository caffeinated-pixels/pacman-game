const startGameSoundUrl = new URL(
  '../../../media/start-game.mp3',
  import.meta.url
)
export const startGameSound = new Audio(startGameSoundUrl.href)

const munchSoundUrl = new URL(
  '../../../media/pacman-munch.mp3',
  import.meta.url
)
export const munchSound = new Audio(munchSoundUrl.href)

const fruitEatenSoundUrl = new URL(
  '../../../media/fruit-eaten.mp3',
  import.meta.url
)
export const fruitEatenSound = new Audio(fruitEatenSoundUrl.href)

const deathSoundUrl = new URL(
  '../../../media/pacman-death.mp3',
  import.meta.url
)
export const deathSound = new Audio(deathSoundUrl.href)

const ghostEatenSoundUrl = new URL(
  '../../../media/ghost-eaten.mp3',
  import.meta.url
)
export const ghostEatenSound = new Audio(ghostEatenSoundUrl.href)

const powerPillSoundUrl = new URL(
  '../../../media/pacman-energizer.mp3',
  import.meta.url
)
export const powerPillSound = new Audio(powerPillSoundUrl.href)

export const stopPowerPillSound = () => {
  powerPillSound.pause()
  powerPillSound.currentTime = 0
}
