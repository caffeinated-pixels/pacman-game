export function movePacman (state, direction) {
  const newIndex = state.pacmanCurrentIndex + direction
  if (
    !state.squares[newIndex].classList.contains('ghost-lair') &&
    !state.squares[newIndex].classList.contains('wall')
  ) {
    state.pacmanCurrentIndex = newIndex
    state.pacmanCurrentDirection = direction
    switch (direction) {
      case 1:
        state.pacmanMovementClass = 'pacman-facing-right'
        break
      case -1:
        state.pacmanMovementClass = 'pacman-facing-left'
        break
      case 28:
        state.pacmanMovementClass = 'pacman-facing-down'
        break
      case -28:
        state.pacmanMovementClass = 'pacman-facing-up'
        break
    }
  }

  if (state.pacmanCurrentIndex === 392) {
    state.pacmanCurrentIndex = 419
  } else if (state.pacmanCurrentIndex === 419) {
    state.pacmanCurrentIndex = 392
  }
}
