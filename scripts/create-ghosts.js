function ghost (
  className,
  startIndex,
  respawnIndex,
  startTimer,
  speed,
  currentDirection,
  scatterTarget
) {
  return {
    className,
    startIndex,
    respawnIndex,
    startTimer, // state.dotsEaten threshold
    speed,
    currentDirection,
    scatterTarget,
    currentIndex: startIndex,
    targetTile: 0,
    nextDirection: 0,
    isFrightened: false,
    isFlashing: false,
    firstMoveAfterFrightened: false,
    timerId: NaN,
    frightenedTimer: NaN,
    flashTimerId: NaN
  }
}

export function createNewGhosts (width) {
  return [
    ghost('blinky', 321, 377, 0, 500, -1, -1),
    ghost('pinky', 378, 378, 5, 500, -width, -28),
    ghost('inky', 376, 376, 30, 500, 1, 895),
    ghost('clyde', 379, 379, 90, 500, -1, 868)
  ]

  // return [new Ghost('clyde', 379, 379, 0, 500, -1, 868)]
  // return [new Ghost('blinky', 321, 377, 0, 1000, -1, -1)]
  // return [new Ghost('blinky', 394, 377, 0, 1000, -1, -1)]
  // return [new Ghost('blinky', 417, 377, 0, 1000, 1, -1)]
}

export function drawGhosts (state) {
  state.ghosts.forEach(ghost => {
    state.squares[ghost.currentIndex].classList.add(ghost.className)
    state.squares[ghost.currentIndex].classList.add('ghost')
  })
}
