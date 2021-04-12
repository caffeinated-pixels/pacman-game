export function movePacman (state, direction) {
  if (
    !state.squares[direction].classList.contains('ghost-lair') &&
    !state.squares[direction].classList.contains('wall')
  ) {
    state.pacmanCurrentIndex = direction
  }

  if (state.pacmanCurrentIndex === 392) {
    state.pacmanCurrentIndex = 419
  } else if (state.pacmanCurrentIndex === 419) {
    state.pacmanCurrentIndex = 392
  }
}
