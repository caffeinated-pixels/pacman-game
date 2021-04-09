class Ghost {
  constructor (className, startIndex, speed, direction) {
    this.className = className
    this.startIndex = startIndex
    this.speed = speed
    this.currentIndex = startIndex
    this.currentDirection = direction
    this.newIndex = startIndex + direction
    this.isScared = false
    this.timerId = NaN
  }
}

export function createNewGhosts (width) {
  return [
    new Ghost('blinky', 349, 250, -width),
    new Ghost('pinky', 405, 400, -width),
    new Ghost('inky', 350, 300, -width),
    new Ghost('clyde', 406, 500, -width)
  ]
}

export function drawGhosts (state) {
  state.ghosts.forEach(ghost => {
    state.squares[ghost.currentIndex].classList.add(ghost.className)
    state.squares[ghost.currentIndex].classList.add('ghost')
  })
}
