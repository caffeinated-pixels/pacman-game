class Ghost {
  constructor (className, startIndex, speed, direction) {
    this.className = className
    this.startIndex = startIndex
    this.speed = speed
    this.currentIndex = startIndex
    this.currentDirection = direction
    this.nextDirection = 0
    this.isScared = false
    this.timerId = NaN
  }
}

export function createNewGhosts (width) {
  // return [
  //   new Ghost('blinky', 321, 250, -1),
  //   new Ghost('pinky', 405, 400, -width),
  //   new Ghost('inky', 350, 300, -width),
  //   new Ghost('clyde', 406, 500, -width)
  // ]

  return [new Ghost('blinky', 321, 1000, -1)]
}

export function drawGhosts (state) {
  state.ghosts.forEach(ghost => {
    state.squares[ghost.currentIndex].classList.add(ghost.className)
    state.squares[ghost.currentIndex].classList.add('ghost')
  })
}
