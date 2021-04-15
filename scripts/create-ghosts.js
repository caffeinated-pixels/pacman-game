class Ghost {
  constructor (className, startIndex, speed, direction, scatterTarget) {
    this.className = className
    this.startIndex = startIndex
    this.speed = speed
    this.currentIndex = startIndex
    this.currentDirection = direction
    this.scatterTarget = scatterTarget
    this.targetTile = 0
    this.nextDirection = 0
    this.isScared = false
    this.timerId = NaN
  }
}

export function createNewGhosts (width) {
  // return [
  //   new Ghost('blinky', 321, 250, -1, -1),
  //   new Ghost('pinky', 405, 400, -width, -28),
  //   new Ghost('inky', 350, 300, -width, 895),
  //   new Ghost('clyde', 406, 500, -width, 868)
  // ]

  // return [new Ghost('blinky', 321, 1000, -1, -1)]
  // return [new Ghost('pinky', 321, 1000, -1, -28)]
  return [
    new Ghost('blinky', 321, 2000, -1, -1),
    new Ghost('inky', 350, 2000, -1, 895)
  ]
  // return [new Ghost('clyde', 321, 500, -1, 868)]
}

export function drawGhosts (state) {
  state.ghosts.forEach(ghost => {
    state.squares[ghost.currentIndex].classList.add(ghost.className)
    state.squares[ghost.currentIndex].classList.add('ghost')
  })
}
