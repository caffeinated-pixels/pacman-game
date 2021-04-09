import { layout } from './layout.js'
import { state } from './game-state.js'
import { createNewGhosts, drawGhosts } from './create-ghosts.js'
import { movePacman } from './pacman-movement.js'

// element variables
const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
const hiscoreDisplay = document.getElementById('hiscore')
const startButton = document.getElementById('start-btn')
const resetButton = document.getElementById('reset')

// event handlers
document.addEventListener('keydown', handleControlInput)
startButton.addEventListener('click', handleStartBtn)
resetButton.addEventListener('click', resetGame)
document
  .querySelectorAll('.d-btn')
  .forEach(item => item.addEventListener('click', handleControlInput))

const playIcon = '<i class="fas fa-play"></i>'
const pauseIcon = '<i class="fas fa-pause"></i>'
const width = 28

// setup board
createBoard()
getHiscoreFromStorage()

function getHiscoreFromStorage () {
  if (localStorage.pacmanHiscore) {
    state.hiscore = localStorage.pacmanHiscore
    hiscoreDisplay.textContent = state.hiscore
  }
}

function createBoard () {
  state.squares = layout.map(cell => {
    const square = document.createElement('div')

    grid.appendChild(square)

    if (cell === 0) {
      square.classList.add('pac-dot')
    } else if (cell === 1) {
      square.classList.add('wall')
    } else if (cell === 2) {
      square.classList.add('ghost-lair')
    } else if (cell === 3) {
      square.classList.add('power-pellet')
    }

    return square
  })
}

function handleStartBtn () {
  if (state.isGameOver) {
    startGame()
  } else if (state.isPaused) {
    pauseGame()
  } else if (!state.isPaused) {
    resumeGame()
  }
}

function startGame () {
  startButton.innerHTML = pauseIcon

  // draw Pacman
  state.pacmanCurrentIndex = 490
  state.squares[state.pacmanCurrentIndex].classList.add('pacman')

  // draw Ghosts
  state.ghosts = createNewGhosts()
  state.ghosts.forEach(ghost => moveGhost(ghost))
  drawGhosts(state)

  state.isGameOver = false
  state.isPaused = false
}

function pauseGame () {
  state.isPaused = false
  startButton.innerHTML = pauseIcon
  state.ghosts.forEach(ghost => moveGhost(ghost))
}

function resumeGame () {
  state.isPaused = true
  startButton.innerHTML = playIcon
  state.ghosts.forEach(ghost => clearInterval(ghost.timerId))
}

function resetGame () {
  state.ghosts.forEach(ghost => clearInterval(ghost.timerId))
  state.isPaused = true
  state.isGameOver = true
  state.score = 0
  scoreDisplay.textContent = state.score
  grid.innerHTML = ''
  startButton.innerHTML = playIcon
  createBoard()
}

function handleControlInput (event) {
  if (state.isPaused) return
  const input = event.type === 'keydown' ? event.key : event.currentTarget.id

  state.squares[state.pacmanCurrentIndex].classList.remove('pacman')

  switch (input) {
    case 'ArrowDown':
    case 'down':
      movePacman(state, state.pacmanCurrentIndex + width)
      break
    case 'ArrowUp':
    case 'up':
      movePacman(state, state.pacmanCurrentIndex - width)
      break
    case 'ArrowLeft':
    case 'left':
      movePacman(state, state.pacmanCurrentIndex - 1)
      break
    case 'ArrowRight':
    case 'right':
      movePacman(state, state.pacmanCurrentIndex + 1)
      break
  }

  state.squares[state.pacmanCurrentIndex].classList.add('pacman')

  pacDotEaten()
  powerPelletEaten()
  checkForWin()
  checkForGameOver()
}

function pacDotEaten () {
  if (state.squares[state.pacmanCurrentIndex].classList.contains('pac-dot')) {
    state.squares[state.pacmanCurrentIndex].classList.remove('pac-dot')
    state.score += 10
    scoreDisplay.textContent = state.score
  }
}

function powerPelletEaten () {
  // if square pacman is in contains a power pellet
  if (
    state.squares[state.pacmanCurrentIndex].classList.contains('power-pellet')
  ) {
    // remove power pellet class
    state.squares[state.pacmanCurrentIndex].classList.remove('power-pellet')
    // add a score of 10
    state.score += 50
    scoreDisplay.textContent = state.score
    // change each of the four ghosts to isScared
    state.ghosts.forEach(ghost => (ghost.isScared = true))
    // use setTimeout to unscare ghosts after 10 seconds
    setTimeout(unScareGhosts, 10000)
  }
}

function unScareGhosts () {
  state.ghosts.forEach(ghost => (ghost.isScared = false))
}

function moveGhost (ghost) {
  const directions = [-1, +1, -width, +width]
  let direction = directions[Math.floor(Math.random() * directions.length)]

  ghost.timerId = setInterval(function () {
    if (
      !state.squares[ghost.currentIndex + direction].classList.contains(
        'wall'
      ) &&
      !state.squares[ghost.currentIndex + direction].classList.contains('ghost')
    ) {
      // remove any ghost
      state.squares[ghost.currentIndex].classList.remove(ghost.className)
      state.squares[ghost.currentIndex].classList.remove(
        'ghost',
        'scared-ghost'
      )
      // //add direction to current Index
      ghost.currentIndex += direction
      // //add ghost class
      state.squares[ghost.currentIndex].classList.add(ghost.className)
      state.squares[ghost.currentIndex].classList.add('ghost')
    } else direction = directions[Math.floor(Math.random() * directions.length)]

    // if the ghost is currently scared
    isGhostScared(ghost)
    didPacmanEatGhost(ghost)
    checkForGameOver()
  }, ghost.speed)
}

function isGhostScared (ghost) {
  if (ghost.isScared) {
    state.squares[ghost.currentIndex].classList.add('scared-ghost')
  }
}

function didPacmanEatGhost (ghost) {
  if (
    ghost.isScared &&
    state.squares[ghost.currentIndex].classList.contains('pacman')
  ) {
    // remove classnames - ghost.className, 'ghost', 'scared-ghost'
    state.squares[ghost.currentIndex].classList.remove(
      ghost.className,
      'ghost',
      'scared-ghost'
    )
    // change ghosts currentIndex back to its startIndex
    ghost.currentIndex = ghost.startIndex

    state.score += 200
    // re-add classnames of ghost.className and 'ghost' to the ghosts new postion
    state.squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
  }
}

// check for game over
function checkForGameOver () {
  // if the square pacman is in contains a ghost AND the square does NOT contain a scared ghost
  if (
    state.squares[state.pacmanCurrentIndex].classList.contains('ghost') &&
    !state.squares[state.pacmanCurrentIndex].classList.contains('scared-ghost')
  ) {
    // for each ghost - we need to stop it moving
    state.ghosts.forEach(ghost => clearInterval(ghost.timerId))

    state.isGameOver = true
    checkForHiscore()
    resetGame()
  }
}

function checkForHiscore () {
  if (state.score > state.hiscore) {
    state.hiscore = state.score
    hiscoreDisplay.textContent = state.hiscore
    localStorage.setItem('pacmanHiscore', state.hiscore)
  }
}

// check for win
function checkForWin () {
  if (state.score === 274) {
    // stop each ghost
    state.ghosts.forEach(ghost => clearInterval(ghost.timerId))

    // tell our user we have won
    scoreDisplay.innerHTML = 'You WON!'
  }
}
