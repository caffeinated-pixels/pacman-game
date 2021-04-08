export function movePacmanDown (state, width) {
  if (
    !state.squares[state.pacmanCurrentIndex + width].classList.contains(
      'ghost-lair'
    ) &&
    !state.squares[state.pacmanCurrentIndex + width].classList.contains(
      'wall'
    ) &&
    state.pacmanCurrentIndex + width < width * width
  ) {
    state.pacmanCurrentIndex += width
  }
}

export function movePacmanUp (state, width) {
  if (
    !state.squares[state.pacmanCurrentIndex - width].classList.contains(
      'ghost-lair'
    ) &&
    !state.squares[state.pacmanCurrentIndex - width].classList.contains(
      'wall'
    ) &&
    state.pacmanCurrentIndex - width >= 0
  ) {
    state.pacmanCurrentIndex -= width
  }
}

export function movePacmanLeft (state, width) {
  if (
    !state.squares[state.pacmanCurrentIndex - 1].classList.contains(
      'ghost-lair'
    ) &&
    !state.squares[state.pacmanCurrentIndex - 1].classList.contains('wall') &&
    state.pacmanCurrentIndex % width !== 0
  ) {
    state.pacmanCurrentIndex -= 1
  }
  if (state.pacmanCurrentIndex === 364) {
    state.pacmanCurrentIndex = 391
  }
}

export function movePacmanRight (state, width) {
  if (
    !state.squares[state.pacmanCurrentIndex + 1].classList.contains(
      'ghost-lair'
    ) &&
    !state.squares[state.pacmanCurrentIndex + 1].classList.contains('wall') &&
    state.pacmanCurrentIndex % width < width - 1
  ) {
    state.pacmanCurrentIndex += 1
  }
  if (state.pacmanCurrentIndex === 391) {
    state.pacmanCurrentIndex = 364
  }
}
