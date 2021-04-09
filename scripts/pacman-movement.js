export function movePacmanDown (state, width) {
  const moveDown = state.pacmanCurrentIndex + width

  if (
    !state.squares[moveDown].classList.contains('ghost-lair') &&
    !state.squares[moveDown].classList.contains('wall') &&
    moveDown < width * width
  ) {
    state.pacmanCurrentIndex += width
  }
}

export function movePacmanUp (state, width) {
  const moveUp = state.pacmanCurrentIndex - width
  if (
    !state.squares[moveUp].classList.contains('ghost-lair') &&
    !state.squares[moveUp].classList.contains('wall') &&
    moveUp >= 0
  ) {
    state.pacmanCurrentIndex -= width
  }
}

export function movePacmanLeft (state, width) {
  const moveLeft = state.pacmanCurrentIndex - 1
  if (
    !state.squares[moveLeft].classList.contains('ghost-lair') &&
    !state.squares[moveLeft].classList.contains('wall') &&
    state.pacmanCurrentIndex % width !== 0
  ) {
    state.pacmanCurrentIndex -= 1
  }
  if (state.pacmanCurrentIndex === 364) {
    state.pacmanCurrentIndex = 391
  }
}

export function movePacmanRight (state, width) {
  const moveRight = state.pacmanCurrentIndex + 1
  if (
    !state.squares[moveRight].classList.contains('ghost-lair') &&
    !state.squares[moveRight].classList.contains('wall') &&
    state.pacmanCurrentIndex % width < width - 1
  ) {
    state.pacmanCurrentIndex += 1
  }
  if (state.pacmanCurrentIndex === 391) {
    state.pacmanCurrentIndex = 364
  }
}
