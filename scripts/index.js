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
const pacmanHTML =
  '<div class="pacman-top"></div><div class="pacman-bottom"></div>'
const width = 28
const height = 31

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
    square.classList.add('cell', cell)

    if (cell === 'door') {
      square.classList.add('ghost-lair')
    }

    return square
  })

  addWallborders()
}

function addWallborders () {
  state.squares.forEach((square, i, arr) => {
    // checking for wall exterior sides
    const isAtTopEdge = i - width < 0
    const isAtRightEdge = i % width === width - 1
    const isAtBottomEdge = i + width >= width * height
    const isAtLeftEdge = i % width === 0

    // check for wall internal sides
    const isTopSide =
      i - width > 28 && !arr[i - width].classList.contains('wall')

    const isRightSide = i + 1 < 867 && !arr[i + 1].classList.contains('wall')

    const isBottomSide =
      i + width < width * 30 && !arr[i + width].classList.contains('wall')

    const isLeftSide = i - 1 > 0 && !arr[i - 1].classList.contains('wall')

    // add wall border classes
    if (square.classList.contains('wall')) {
      if (isAtTopEdge || isTopSide) {
        square.classList.add('border-top')
      }
      if (isAtRightEdge || isRightSide) {
        square.classList.add('border-right')
      }
      if (isAtBottomEdge || isBottomSide) {
        square.classList.add('border-bottom')
      }
      if (isAtLeftEdge || isLeftSide) square.classList.add('border-left')
    }
  })
}

function handleStartBtn () {
  if (state.isGameOver) {
    startGame()
  } else if (state.isPaused) {
    resumeGame()
  } else if (!state.isPaused) {
    pauseGame()
  }
}

function startGame () {
  startButton.innerHTML = pauseIcon

  // draw Pacman
  state.pacmanCurrentIndex = 490
  state.pacmanMovementClass = 'pacman-facing-right'
  state.squares[state.pacmanCurrentIndex].classList.add(
    'pacman',
    state.pacmanMovementClass
  )
  state.squares[state.pacmanCurrentIndex].innerHTML = pacmanHTML

  // draw Ghosts
  state.ghosts = createNewGhosts(width)
  drawGhosts(state)

  // initate ghost movement
  state.ghosts.forEach(ghost => initGhostMovement(ghost))

  state.isGameOver = false
  state.isPaused = false
}

function resumeGame () {
  state.isPaused = false
  startButton.innerHTML = pauseIcon
  state.ghosts.forEach(ghost => initGhostMovement(ghost))
}

function pauseGame () {
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

  state.squares[state.pacmanCurrentIndex].classList.remove(
    'pacman',
    state.pacmanMovementClass
  )
  state.squares[state.pacmanCurrentIndex].innerHTML = ''

  switch (input) {
    case 'ArrowDown':
    case 'down':
      movePacman(state, width)
      break
    case 'ArrowUp':
    case 'up':
      movePacman(state, -width)
      break
    case 'ArrowLeft':
    case 'left':
      movePacman(state, -1)
      break
    case 'ArrowRight':
    case 'right':
      movePacman(state, 1)
      break
  }

  state.squares[state.pacmanCurrentIndex].classList.add(
    'pacman',
    state.pacmanMovementClass
  )
  state.squares[state.pacmanCurrentIndex].innerHTML = pacmanHTML

  pacDotEaten()
  powerPillEaten()
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

function powerPillEaten () {
  // if square pacman is in contains a power pellet
  if (
    state.squares[state.pacmanCurrentIndex].classList.contains('power-pill')
  ) {
    // remove power pellet class
    state.squares[state.pacmanCurrentIndex].classList.remove('power-pill')
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

function initGhostMovement (ghost) {
  ghost.timerId = setInterval(function () {
    moveGhost(ghost)
    isGhostScared(ghost)
    didPacmanEatGhost(ghost)
    checkForGameOver()
  }, ghost.speed)
}

function moveGhost (ghost) {
  // console.log(ghost.currentDirection, ghost.currentIndex)
  const newIndex = ghost.currentIndex + ghost.currentDirection

  if (checkForGhostCollision(newIndex)) {
    setNewGhostIndex(ghost)
    moveGhost(ghost)
  } else {
    state.squares[ghost.currentIndex].classList.remove(ghost.className)
    state.squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')

    ghost.currentIndex += ghost.currentDirection

    state.squares[ghost.currentIndex].classList.add(ghost.className)
    state.squares[ghost.currentIndex].classList.add('ghost')
  }
}

function checkForGhostCollision (newIndex) {
  return (
    state.squares[newIndex].classList.contains('wall') ||
    state.squares[newIndex].classList.contains('ghost')
  )
}

function setNewGhostIndex (ghost) {
  const directions = [-1, 1, -width, width]

  const filteredDirections = directions.filter(direction => {
    const newIndex = ghost.currentIndex + direction
    return !checkForGhostCollision(newIndex)
  })

  ghost.currentDirection =
    filteredDirections[Math.floor(Math.random() * filteredDirections.length)]
  ghost.newIndex = ghost.currentDirection + ghost.currentIndex
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
    ghost.isScared = false
    ghost.currentIndex = ghost.startIndex
    ghost.currentDirection = -width
    ghost.newIndex = ghost.startIndex + -width

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
