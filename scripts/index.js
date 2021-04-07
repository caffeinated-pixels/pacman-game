import { layout } from './layout.js'

// element variables
const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
const startButton = document.getElementById('start-btn')

document.addEventListener('keydown', control)
startButton.addEventListener('click', startGame)

// game state
const width = 28
let squares = []
let score = 0
let pacmanCurrentIndex = 490

// create board
function createBoard () {
  squares = layout.map(cell => {
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

createBoard()

function startGame () {
  ghosts.forEach(ghost => moveGhost(ghost))
}

squares[pacmanCurrentIndex].classList.add('pacman')

function control (event) {
  squares[pacmanCurrentIndex].classList.remove('pacman')
  switch (event.key) {
    case 'ArrowDown':
      console.log('pressed down')
      if (
        !squares[pacmanCurrentIndex + width].classList.contains('ghost-lair') &&
        !squares[pacmanCurrentIndex + width].classList.contains('wall') &&
        pacmanCurrentIndex + width < width * width
      ) {
        pacmanCurrentIndex += width
      }
      break
    case 'ArrowUp':
      console.log('pressed up')
      if (
        !squares[pacmanCurrentIndex - width].classList.contains('ghost-lair') &&
        !squares[pacmanCurrentIndex - width].classList.contains('wall') &&
        pacmanCurrentIndex - width >= 0
      ) {
        pacmanCurrentIndex -= width
      }
      break
    case 'ArrowLeft':
      console.log('pressed left')
      if (
        !squares[pacmanCurrentIndex - 1].classList.contains('ghost-lair') &&
        !squares[pacmanCurrentIndex - 1].classList.contains('wall') &&
        pacmanCurrentIndex % width !== 0
      ) {
        pacmanCurrentIndex -= 1
      }
      if (pacmanCurrentIndex === 364) {
        pacmanCurrentIndex = 391
      }
      break
    case 'ArrowRight':
      console.log('pressed right')
      if (
        !squares[pacmanCurrentIndex + 1].classList.contains('ghost-lair') &&
        !squares[pacmanCurrentIndex + 1].classList.contains('wall') &&
        pacmanCurrentIndex % width < width - 1
      ) {
        pacmanCurrentIndex += 1
      }
      if (pacmanCurrentIndex === 391) {
        pacmanCurrentIndex = 364
      }
      break
  }
  squares[pacmanCurrentIndex].classList.add('pacman')
  pacDotEaten()
  powerPelletEaten()
  checkForWin()
  checkForGameOver()
}

function pacDotEaten () {
  if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
    squares[pacmanCurrentIndex].classList.remove('pac-dot')
    score++
    scoreDisplay.innerHTML = score
  }
}

function powerPelletEaten () {
  // if square pacman is in contains a power pellet
  if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
    // remove power pellet class
    squares[pacmanCurrentIndex].classList.remove('power-pellet')
    // add a score of 10
    score += 10
    // change each of the four ghosts to isScared
    ghosts.forEach(ghost => (ghost.isScared = true))
    // use setTimeout to unscare ghosts after 10 seconds
    setTimeout(unScareGhosts, 10000)
  }
}

function unScareGhosts () {
  ghosts.forEach(ghost => (ghost.isScared = false))
}

class Ghost {
  constructor (className, startIndex, speed) {
    this.className = className
    this.startIndex = startIndex
    this.speed = speed
    this.currentIndex = startIndex
    this.isScared = false
    this.timerId = NaN
  }
}

const ghosts = [
  new Ghost('blinky', 348, 250),
  new Ghost('pinky', 376, 400),
  new Ghost('inky', 351, 300),
  new Ghost('clyde', 379, 500)
]

// draw my ghosts onto my grid
ghosts.forEach(ghost => {
  squares[ghost.currentIndex].classList.add(ghost.className)
  squares[ghost.currentIndex].classList.add('ghost')
})

function moveGhost (ghost) {
  console.log('moved ghost')
  const directions = [-1, +1, -width, +width]
  let direction = directions[Math.floor(Math.random() * directions.length)]
  console.log(direction)

  ghost.timerId = setInterval(function () {
    // all our code
    // if the next square does NOT contain a wall and does not contain a ghost
    if (
      !squares[ghost.currentIndex + direction].classList.contains('wall') &&
      !squares[ghost.currentIndex + direction].classList.contains('ghost')
    ) {
      // remove any ghost
      squares[ghost.currentIndex].classList.remove(ghost.className)
      squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
      // //add direction to current Index
      ghost.currentIndex += direction
      // //add ghost class
      squares[ghost.currentIndex].classList.add(ghost.className)
      squares[ghost.currentIndex].classList.add('ghost')
    } else direction = directions[Math.floor(Math.random() * directions.length)]

    // if the ghost is currently scared
    if (ghost.isScared) {
      squares[ghost.currentIndex].classList.add('scared-ghost')
    }

    // if the ghost is current scared AND pacman is on it
    if (
      ghost.isScared &&
      squares[ghost.currentIndex].classList.contains('pacman')
    ) {
      // remove classnames - ghost.className, 'ghost', 'scared-ghost'
      squares[ghost.currentIndex].classList.remove(
        ghost.className,
        'ghost',
        'scared-ghost'
      )
      // change ghosts currentIndex back to its startIndex
      ghost.currentIndex = ghost.startIndex
      // add a score of 100
      score += 100
      // re-add classnames of ghost.className and 'ghost' to the ghosts new postion
      squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
    }
    checkForGameOver()
  }, ghost.speed)
}

// check for game over
function checkForGameOver () {
  // if the square pacman is in contains a ghost AND the square does NOT contain a scared ghost
  if (
    squares[pacmanCurrentIndex].classList.contains('ghost') &&
    !squares[pacmanCurrentIndex].classList.contains('scared-ghost')
  ) {
    // for each ghost - we need to stop it moving
    ghosts.forEach(ghost => clearInterval(ghost.timerId))
    // remove eventlistener from our control function
    document.removeEventListener('keyup', control)
    // tell user the game is over
    scoreDisplay.innerHTML = 'You LOSE'
  }
}

// check for win
function checkForWin () {
  if (score === 274) {
    // stop each ghost
    ghosts.forEach(ghost => clearInterval(ghost.timerId))
    // remove the eventListener for the control function
    document.removeEventListener('keyup', control)
    // tell our user we have won
    scoreDisplay.innerHTML = 'You WON!'
  }
}
