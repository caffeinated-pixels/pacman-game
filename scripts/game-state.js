export const state = {
  squares: [],
  score: 0,
  hiscore: 0,
  livesLeft: 2,
  pacmanCurrentIndex: 0,
  pacmanCurrentDirection: 1,
  pacmanMovementClass: 'pacman-facing-right',
  dotsEaten: 0,
  ghostsEaten: 0,
  firstBonusRemoved: false,
  secondBonusRemoved: false,
  isPaused: true,
  isGameOver: true,
  ghosts: [],
  getReadyTimer: NaN,
  gameoverTimer: NaN
}
