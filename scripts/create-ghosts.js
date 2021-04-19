class Ghost {
  constructor (
    className,
    startIndex,
    respawnIndex,
    startTimer,
    speed,
    direction,
    scatterTarget
  ) {
    this.className = className
    this.startIndex = startIndex
    this.respawnIndex = respawnIndex
    this.startTimer = startTimer
    this.speed = speed
    this.currentIndex = startIndex
    this.currentDirection = direction
    this.scatterTarget = scatterTarget
    this.targetTile = 0
    this.nextDirection = 0
    this.isFrightened = false
    this.isFlashing = false
    this.firstMoveAfterFrightened = false
    this.timerId = NaN
    this.flashTimerId = NaN
  }
}

export function createNewGhosts (width) {
  // return [
  //   new Ghost('blinky', 321, 377, 0, 500, -1, -1),
  //   new Ghost('pinky', 378, 378, 5, 500, -width, -28),
  //   new Ghost('inky', 376, 376, 30, 500, 1, 895),
  //   new Ghost('clyde', 379, 379, 90, 500, -1, 868)
  // ]

  // return [new Ghost('clyde', 379, 379, 0, 500, -1, 868)]
  return [new Ghost('blinky', 321, 377, 0, 1000, -1, -1)]
}

export function drawGhosts (state) {
  state.ghosts.forEach(ghost => {
    state.squares[ghost.currentIndex].classList.add(ghost.className)
    state.squares[ghost.currentIndex].classList.add('ghost')
  })
}
