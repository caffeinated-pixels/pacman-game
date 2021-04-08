import { layout } from './layout.js'
import { state } from './game-state.js'
import { createNewGhosts } from './ghosts.js'

// element variables
const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
const startButton = document.getElementById('start-btn')
const resetButton = document.getElementById('reset')

// event handlers
document.addEventListener('keydown', handleControlInput)
startButton.addEventListener('click', handleStartBtn)
resetButton.addEventListener('click', resetGame)

const playIcon = '<i class="fas fa-play"></i>'
const pauseIcon = '<i class="fas fa-pause"></i>'
const width = 28

// setup board
createBoard()

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
  state.pacmanCurrentIndex = 490
  state.squares[state.pacmanCurrentIndex].classList.add('pacman')
  state.ghosts = createNewGhosts()
  state.ghosts.forEach(ghost => moveGhost(ghost))
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
  state.squares[state.pacmanCurrentIndex].classList.remove('pacman')
  switch (event.key) {
    case 'ArrowDown':
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
      break
    case 'ArrowUp':
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
      break
    case 'ArrowLeft':
      if (
        !state.squares[state.pacmanCurrentIndex - 1].classList.contains(
          'ghost-lair'
        ) &&
        !state.squares[state.pacmanCurrentIndex - 1].classList.contains(
          'wall'
        ) &&
        state.pacmanCurrentIndex % width !== 0
      ) {
        state.pacmanCurrentIndex -= 1
      }
      if (state.pacmanCurrentIndex === 364) {
        state.pacmanCurrentIndex = 391
      }
      break
    case 'ArrowRight':
      if (
        !state.squares[state.pacmanCurrentIndex + 1].classList.contains(
          'ghost-lair'
        ) &&
        !state.squares[state.pacmanCurrentIndex + 1].classList.contains(
          'wall'
        ) &&
        state.pacmanCurrentIndex % width < width - 1
      ) {
        state.pacmanCurrentIndex += 1
      }
      if (state.pacmanCurrentIndex === 391) {
        state.pacmanCurrentIndex = 364
      }
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
    scoreDisplay.innerHTML = state.score
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
    // change each of the four ghosts to isScared
    state.ghosts.forEach(ghost => (ghost.isScared = true))
    // use setTimeout to unscare ghosts after 10 seconds
    setTimeout(unScareGhosts, 10000)
  }
}

function unScareGhosts () {
  state.ghosts.forEach(ghost => (ghost.isScared = false))
}

// draw my ghosts onto my grid
state.ghosts.forEach(ghost => {
  state.squares[ghost.currentIndex].classList.add(ghost.className)
  state.squares[ghost.currentIndex].classList.add('ghost')
})

function moveGhost (ghost) {
  const directions = [-1, +1, -width, +width]
  let direction = directions[Math.floor(Math.random() * directions.length)]

  ghost.timerId = setInterval(function () {
    // all our code
    // if the next square does NOT contain a wall and does not contain a ghost
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
    if (ghost.isScared) {
      state.squares[ghost.currentIndex].classList.add('scared-ghost')
    }

    // if the ghost is current scared AND pacman is on it
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
    checkForGameOver()
  }, ghost.speed)
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

    // tell user the game is over
    scoreDisplay.innerHTML = 'You LOSE'
    state.isGameOver = true
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
