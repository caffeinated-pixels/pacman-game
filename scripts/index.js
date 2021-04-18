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
const pacmanStartIndex = 658
const ghostDirections = [-width, -1, width, 1] // up, left, down, right

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
  state.pacmanCurrentIndex = pacmanStartIndex
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
  state.dotsEaten = 0
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
    state.squares[state.pacmanCurrentIndex].classList.add('blank')
    state.dotsEaten++
    state.score += 10
    scoreDisplay.textContent = state.score
  }
}

function powerPillEaten () {
  if (
    state.squares[state.pacmanCurrentIndex].classList.contains('power-pill')
  ) {
    state.squares[state.pacmanCurrentIndex].classList.remove('power-pill')
    state.squares[state.pacmanCurrentIndex].classList.add('blank')

    state.score += 50
    state.dotsEaten++
    scoreDisplay.textContent = state.score
    frightenGhosts()
  }
}

function frightenGhosts () {
  state.ghosts.forEach(ghost => {
    if (!state.squares[ghost.currentIndex].classList.contains('ghost-lair')) {
      ghost.isFrightened = true
      ghost.firstMoveAfterFrightened = true
      state.squares[ghost.currentIndex].classList.add('frightened-ghost')
    }
  })
  setTimeout(unFrightenGhosts, 10000)
}

function unFrightenGhosts () {
  state.ghosts.forEach(ghost => (ghost.isFrightened = false))
}

function isGhostFrightened (ghost) {
  if (ghost.isFrightened) {
    state.squares[ghost.currentIndex].classList.add('frightened-ghost')
  }
}

function initGhostMovement (ghost) {
  ghost.timerId = setInterval(function () {
    if (state.dotsEaten >= ghost.startTimer) {
      didPacmanEatGhost(ghost)
      moveGhost(ghost)
      isGhostFrightened(ghost)
      checkForGameOver()
    }
  }, ghost.speed)
}

function moveGhost (ghost) {
  // console.log('START OF MOVE')
  // console.log(ghost)
  if (ghost.isFrightened) {
    ghost.nextDirection = getFrightenedGhostDirection(ghost)
  } else {
    setGhostTarget(ghost)
    ghost.nextDirection = getNextGhostDirection(ghost)
  }

  // console.log('chosen direction = ' + ghost.nextDirection)

  state.squares[ghost.currentIndex].classList.remove(ghost.className)
  state.squares[ghost.currentIndex].classList.remove(
    'ghost',
    'frightened-ghost'
  )

  ghost.currentIndex += ghost.currentDirection
  // FIXME: ghost tunnel movement bugged again, presumably due to targeting scheme!!!
  // tunnel movement
  if (ghost.currentIndex === 392) {
    ghost.currentIndex = 419
  } else if (ghost.currentIndex === 419) {
    ghost.currentIndex = 392
  }

  state.squares[ghost.currentIndex].classList.add(ghost.className)
  state.squares[ghost.currentIndex].classList.add('ghost')

  ghost.currentDirection = ghost.nextDirection
  // console.log(ghost)
  // console.log('END OF MOVE')
}

function getNextGhostDirection (ghost) {
  // ghost plans movement one tile ahead, so we check nextTile for legal direction options
  // cannot reverse direction, return to lair, or move into wall
  const nextTile = ghost.currentIndex + ghost.currentDirection

  if (nextTile === 392) {
    ghost.nextDirection = -1
  } else if (nextTile === 419) {
    ghost.nextDirection = 1
  } else {
    const legalDirections = getLegalGhostDirections(nextTile, ghost)

    if (legalDirections.length > 1) {
      return getTargetTileDistance(legalDirections, nextTile, ghost)
    } else {
      return legalDirections[0]
    }
  }
}

function getFrightenedGhostDirection (ghost) {
  // after first becoming frightened, ghost will attempt to reverse direction (if legal)
  // otherwise we choose a random direction
  if (ghost.firstMoveAfterFrightened) {
    return firstDirectionAfterFrightened(ghost)
  } else {
    return getRandomDirection(ghost)
  }
}

function firstDirectionAfterFrightened (ghost) {
  const reverseTile = ghost.currentIndex + -ghost.currentDirection
  ghost.firstMoveAfterFrightened = false

  if (isDirectionLegal(reverseTile)) {
    return -ghost.currentDirection
  } else {
    return getRandomDirection(ghost)
  }
}

function getRandomDirection (ghost) {
  // if randomDirection not legal, ghost chooses next legal direction in order of up, left, down, right (same as order in ghostDirections arr)
  const randomIndex = Math.floor(Math.random() * ghostDirections.length)
  const randomDirection = ghostDirections[randomIndex]

  const isNotReverseDirection = randomDirection !== -ghost.currentDirection
  // console.log(isNotReverseDirection)

  const nextTile = ghost.currentIndex + ghost.currentDirection

  const directionOption = randomDirection + nextTile

  if (isDirectionLegal(directionOption) && isNotReverseDirection) {
    return randomDirection
  }

  const remainingDirections = ghostDirections.filter(direction => {
    const directionOption = direction + nextTile

    if (direction === randomDirection) return false
    if (direction === -ghost.currentDirection) return false
    return isDirectionLegal(directionOption)
  })

  return remainingDirections[0]
}

function isDirectionLegal (tileIndex) {
  // TODO: incorporate into getLegalGhostDirections

  return (
    !state.squares[tileIndex].classList.contains('wall') &&
    !state.squares[tileIndex].classList.contains('ghost-lair')
  )
}

function getLegalGhostDirections (nextTile, ghost) {
  return ghostDirections.filter(direction => {
    const directionOption = nextTile + direction
    if (direction === -ghost.currentDirection) return false

    if (state.squares[directionOption].classList.contains('blank')) {
      return true
    }
    if (state.squares[directionOption].classList.contains('pac-dot')) {
      return true
    }
    if (state.squares[directionOption].classList.contains('power-pill')) {
      return true
    }
    if (state.squares[directionOption].classList.contains('ghost')) {
      return true
    }

    if (
      state.squares[ghost.currentIndex].classList.contains('ghost-lair') &&
      state.squares[directionOption].classList.contains('ghost-lair')
    ) {
      return true
    }
    return false
  })
}

function getIndexCoords (tileIndex) {
  // find the X,Y coordinates of a given index
  const coordY = Math.floor(tileIndex / 28)
  const coordX = tileIndex - coordY * 28

  return [coordX, coordY]
}

function calcDistance (point1XY, point2XY) {
  return Math.sqrt(
    (point1XY[0] - point2XY[0]) ** 2 + (point1XY[1] - point2XY[1]) ** 2
  )
}

function getTargetTileDistance (legalDirections, nextTile, ghost) {
  const shortestDistance = legalDirections.map(direction => {
    const optionTileIndex = nextTile + direction

    const optionXY = getIndexCoords(optionTileIndex)
    const targetXY = getIndexCoords(ghost.targetTile)

    const distance = calcDistance(optionXY, targetXY)

    return {
      direction,
      distance
    }
  })

  shortestDistance.sort((a, b) => {
    return a.distance - b.distance
  })
  // console.log(shortestDistance)
  return shortestDistance[0].direction
}

function setGhostTarget (ghost) {
  // if in ghost lair, set targetTile manually
  if (state.squares[ghost.currentIndex].classList.contains('ghost-lair')) {
    ghost.targetTile = 321
  } else {
    // else we use specific logic routines to calculate
    if (ghost.className === 'blinky') ghost.targetTile = getBlinkysTarget()
    if (ghost.className === 'pinky') ghost.targetTile = getPinkysTarget()
    if (ghost.className === 'inky') ghost.targetTile = getInkysTarget()
    if (ghost.className === 'clyde') ghost.targetTile = getClydesTarget(ghost)
  }
}

function getBlinkysTarget () {
  // Blinky's target is Pacman's current tile
  return state.pacmanCurrentIndex
}

function getPinkysTarget () {
  // Pinky's target is 4 ahead of Pacman's current tile
  const pacmanXY = getIndexCoords(state.pacmanCurrentIndex)

  // grid is 1D, so we need to prevent the target wrapping to other side of the grid!!!
  if (state.pacmanCurrentDirection === 1 && pacmanXY[0] > 23) {
    return pacmanXY[1] * width + (width - 1)
  }

  if (state.pacmanCurrentDirection === -1 && pacmanXY[0] < 3) {
    return pacmanXY[1] * width
  }

  const fourTileOffset = 4 * state.pacmanCurrentDirection
  return state.pacmanCurrentIndex + fourTileOffset
}

function getInkysTarget () {
  // inky has the most complex targeting scheme!!!
  // we find 2 tile offset from pacman's heading and draw a line from blinky's position
  // we then double the distance and continue past the offset in the same direction

  // find X,Y for 2 tile offset from pacman's heading
  const twoTileOffset =
    2 * state.pacmanCurrentDirection + state.pacmanCurrentIndex
  const offsetXY = getIndexCoords(twoTileOffset)

  // find X,Y for Blinky
  const blinkyXY = getIndexCoords(state.ghosts[0].currentIndex)

  const differenceX = offsetXY[0] - blinkyXY[0]
  const differenceY = offsetXY[1] - blinkyXY[1]

  let targetTileX = offsetXY[0] + differenceX
  const targetTileY = offsetXY[1] + differenceY

  // grid is 1D, so we need to prevent the target wrapping to other side of the grid!!!
  if (targetTileX > 27) {
    targetTileX = 27
  } else if (targetTileX < 0) {
    targetTileX = 0
  }

  const targetTileIndex = targetTileY * width + targetTileX
  return targetTileIndex
}

function getClydesTarget (clyde) {
  const pacmanXY = getIndexCoords(state.pacmanCurrentIndex)
  const clydeXY = getIndexCoords(clyde.currentIndex)

  const distance = calcDistance(pacmanXY, clydeXY)

  if (distance > 8) {
    // if clyde is > 8 tiles from pacman, his targetTile is pacman
    return state.pacmanCurrentIndex
  } else {
    // if clyde is < 8 tiles from pacman, he uses his scatter target
    return clyde.scatterTarget
  }
}

function didPacmanEatGhost (ghost) {
  if (
    ghost.isFrightened &&
    state.squares[ghost.currentIndex].classList.contains('pacman')
  ) {
    // remove classnames - ghost.className, 'ghost', 'frightened-ghost'
    state.squares[ghost.currentIndex].classList.remove(
      ghost.className,
      'ghost',
      'frightened-ghost'
    )
    // change ghosts currentIndex back to its startIndex
    ghost.isFrightened = false
    ghost.currentIndex = ghost.startIndex
    ghost.currentDirection = -width

    state.score += 200
    // re-add classnames of ghost.className and 'ghost' to the ghosts new postion
    state.squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
  }
}

// check for game over
function checkForGameOver () {
  // if the square pacman is in contains a ghost AND the square does NOT contain a frightened ghost
  if (
    state.squares[state.pacmanCurrentIndex].classList.contains('ghost') &&
    !state.squares[state.pacmanCurrentIndex].classList.contains(
      'frightened-ghost'
    )
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
  if (state.dotsEaten > 243) {
    // stop each ghost
    state.ghosts.forEach(ghost => clearInterval(ghost.timerId))

    // tell our user we have won
    scoreDisplay.textContent = 'Winner!'
  }
}
