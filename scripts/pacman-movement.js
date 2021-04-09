export function movePacman (state, direction) {
  if (
    !state.squares[direction].classList.contains('ghost-lair') &&
    !state.squares[direction].classList.contains('wall')
  ) {
    state.pacmanCurrentIndex = direction
  }

  if (state.pacmanCurrentIndex === 391) {
    state.pacmanCurrentIndex = 364
  } else if (state.pacmanCurrentIndex === 364) {
    state.pacmanCurrentIndex = 391
  }
}
