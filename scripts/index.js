import { layout } from './layout.js'
import { state } from './game-state.js'
import { createNewGhosts, drawGhosts } from './create-ghosts.js'
import { movePacman } from './pacman-movement.js'

/************************************************
HTML ELEMENT VARIABLES (START)
*************************************************/
const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
const hiscoreDisplay = document.getElementById('hiscore')
const livesLeftDisplay = document.getElementById('lives-left')
const startScreen = document.getElementById('start-screen')
const pauseScreen = document.getElementById('pause-screen')
const getReadyScreen = document.getElementById('get-ready-screen')
const gameoverScreen = document.getElementById('gameover-screen')
const startButton = document.getElementById('start-btn')
const resetButton = document.getElementById('reset')
/************************************************
HTML ELEMENT VARIABLES (END)
*************************************************/

/************************************************
  GLOBAL CONSTANTS (START)
*************************************************/
const playIcon = '<i class="fas fa-play"></i>'
const pauseIcon = '<i class="fas fa-pause"></i>'
const pacmanHTML =
  '<div class="pacman-top"></div><div class="pacman-bottom"></div>'
const width = 28
const height = 31
const pacmanStartIndex = 658
const ghostDirections = [-width, -1, width, 1] // up, left, down, right
/************************************************
  GLOBAL CONSTANTS (END)
*************************************************/

/************************************************
EVENT LISTENERS (START)
*************************************************/
document.addEventListener('keyup', handleControlInput)
startButton.addEventListener('click', handleStartBtn)
resetButton.addEventListener('click', resetGame)
document
  .querySelectorAll('.d-btn')
  .forEach(item => item.addEventListener('click', handleControlInput))
/************************************************
EVENT LISTENERS (END)
*************************************************/

/************************************************
AUDIO OBJECTS (START)
*************************************************/
const startGameSound = new Audio('../media/start-game.mp3')
const munchSound = new Audio('../media/pacman-munch.mp3')
const fruitEatenSound = new Audio('../media/fruit-eaten.mp3')
const deathSound = new Audio('../media/pacman-death.mp3')
const ghostEatenSound = new Audio('../media/ghost-eaten.mp3')
const powerPillSound = new Audio('../media/pacman-energizer.mp3')

function stopPowerPillSound () {
  powerPillSound.pause()
  powerPillSound.currentTime = 0
}

// fix for getting audio to play on iOS
const audioToUnlock = [
  startGameSound,
  munchSound,
  fruitEatenSound,
  deathSound,
  ghostEatenSound,
  powerPillSound
]
document.addEventListener('touchstart', unlockAudioForiOS)

function unlockAudioForiOS () {
  audioToUnlock.forEach(audio => {
    audio.play()
    audio.pause()
    audio.currentTime = 0
  })

  document.removeEventListener('touchstart', unlockAudioForiOS)
}

/************************************************
AUDIO OBJECTS (END)
*************************************************/

/************************************************
GAMEBOARD SETUP FUNCTIONS (START)
*************************************************/
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

    if (cell === 'bonus-sq') {
      square.classList.add('blank')
    }

    return square
  })

  addWallborders()
  updateLivesDisplay()
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

function updateLivesDisplay () {
  livesLeftDisplay.innerHTML = ''

  for (let i = 0; i < state.livesLeft; i++) {
    const live = document.createElement('div')
    live.classList.add('life')
    live.innerHTML = pacmanHTML
    livesLeftDisplay.appendChild(live)
  }
}

function drawPacman () {
  state.pacmanCurrentIndex = pacmanStartIndex
  state.pacmanMovementClass = 'pacman-facing-right'
  state.squares[state.pacmanCurrentIndex].classList.add(
    'pacman',
    state.pacmanMovementClass
  )
  state.squares[state.pacmanCurrentIndex].innerHTML = pacmanHTML
}
/************************************************
GAMEBOARD SETUP FUNCTIONS (END)
*************************************************/

/************************************************
GAME CONTROLS FUNCTIONS (START)
*************************************************/
function handleStartBtn () {
  if (state.isGameOver) {
    startGameSound.play()
    getReadyTimer()
  } else if (state.isPaused) {
    resumeGame()
  } else if (!state.isPaused) {
    pauseGame()
  }
}

function startGame () {
  startButton.innerHTML = pauseIcon
  getReadyScreen.style.display = 'none'

  drawPacman()

  state.ghosts = createNewGhosts(width)
  drawGhosts(state)
  state.ghosts.forEach(ghost => initGhostMovement(ghost))

  state.isGameOver = false
  state.isPaused = false
}

function resumeGame () {
  state.isPaused = false
  startButton.innerHTML = pauseIcon
  pauseScreen.style.display = 'none'
  state.ghosts.forEach(ghost => initGhostMovement(ghost))
}

function getReadyTimer () {
  startScreen.style.display = 'none'
  getReadyScreen.style.display = 'block'

  state.getReadyTimer = setTimeout(startGame, 1500)
}

function pauseGame () {
  state.isPaused = true
  startButton.innerHTML = playIcon
  pauseScreen.style.display = 'block'
  state.ghosts.forEach(ghost => clearInterval(ghost.timerId))
}

function resetGame () {
  state.ghosts.forEach(ghost => {
    clearInterval(ghost.timerId)
    clearTimeout(ghost.flashTimerId)
  })

  startScreen.style.display = 'block'
  pauseScreen.style.display = 'none'
  getReadyScreen.style.display = 'none'
  gameoverScreen.style.display = 'none'
  clearTimeout(state.getReadyTimer)
  clearTimeout(state.gameoverTimer)

  state.isPaused = true
  state.isGameOver = true
  state.score = 0
  state.livesLeft = 2
  state.dotsEaten = 0
  state.ghostsEatenPoints = 200
  state.firstBonusRemoved = false
  state.secondBonusRemoved = false
  grid.innerHTML = ''
  startButton.innerHTML = playIcon

  stopPowerPillSound()
  updateScore()
  createBoard()
}

function handleControlInput (event) {
  if (state.isPaused) return
  const input = event.type === 'keyup' ? event.key : event.currentTarget.id

  const pacmanCurrentTile = state.squares[state.pacmanCurrentIndex]
  removePacman(pacmanCurrentTile)

  switch (input) {
    case 'ArrowDown':
    case 'down':
    case 's':
      movePacman(state, width)
      break
    case 'ArrowUp':
    case 'up':
    case 'w':
      movePacman(state, -width)
      break
    case 'ArrowLeft':
    case 'left':
    case 'a':
      movePacman(state, -1)
      break
    case 'ArrowRight':
    case 'right':
    case 'd':
      movePacman(state, 1)
      break
  }

  state.squares[state.pacmanCurrentIndex].classList.add(
    'pacman',
    state.pacmanMovementClass
  )
  state.squares[state.pacmanCurrentIndex].innerHTML = pacmanHTML

  didPacmanEatGhost()
  didPacmanEatDot()
  didPacmanEatPowerPill()
  addBonusToBoard()
  didPacmanEatBonus()
  checkForLevelEnd()
  checkForLifeLost()
}

function removePacman (pacmanCurrentTile) {
  pacmanCurrentTile.classList.remove('pacman', state.pacmanMovementClass)
  pacmanCurrentTile.innerHTML = ''
}
/************************************************
GAME CONTROLS FUNCTIONS (END)
*************************************************/

/************************************************
PACMAN EATING FUNCTIONS (START)
*************************************************/
function didPacmanEatDot () {
  if (state.squares[state.pacmanCurrentIndex].classList.contains('pac-dot')) {
    state.squares[state.pacmanCurrentIndex].classList.remove('pac-dot')
    state.squares[state.pacmanCurrentIndex].classList.add('blank')
    state.dotsEaten++
    state.score += 10
    updateScore()
    munchSound.play()
  }
}

function didPacmanEatPowerPill () {
  if (
    state.squares[state.pacmanCurrentIndex].classList.contains('power-pill')
  ) {
    state.squares[state.pacmanCurrentIndex].classList.remove('power-pill')
    state.squares[state.pacmanCurrentIndex].classList.add('blank')

    state.score += 50
    state.dotsEaten++
    state.ghostsEatenPoints = 200
    powerPillSound.currentTime = 0
    powerPillSound.play()
    updateScore()
    frightenGhosts()
  }
}

function addBonusToBoard () {
  if (state.dotsEaten === 70 && !state.firstBonusRemoved) {
    state.squares[490].classList.add('bonus-cherry')
    setTimeout(removeFirstCherry, 10000)
  }

  if (state.dotsEaten === 170 && !state.secondBonusRemoved) {
    state.squares[490].classList.add('bonus-cherry')
    setTimeout(removeSecondCherry, 10000)
  }
}

function removeFirstCherry () {
  state.squares[490].classList.remove('bonus-cherry')
  state.firstBonusRemoved = true
}

function removeSecondCherry () {
  state.squares[490].classList.remove('bonus-cherry')
  state.secondBonusRemoved = true
}

function didPacmanEatBonus () {
  if (
    state.squares[state.pacmanCurrentIndex].classList.contains('bonus-cherry')
  ) {
    state.squares[state.pacmanCurrentIndex].classList.remove('bonus-cherry')
    state.score += 100
    updateScore()
    fruitEatenSound.play()

    if (!state.firstBonusRemoved) {
      state.firstBonusRemoved = true
    } else if (!state.secondBonusRemoved) {
      state.secondBonusRemoved = true
    }
  }
}

function didPacmanEatGhost () {
  const pacmanCurrentSquare = state.squares[state.pacmanCurrentIndex]
  if (pacmanCurrentSquare.classList.contains('frightened-ghost')) {
    const ghost = whichGhostWasEaten(pacmanCurrentSquare)
    returnGhostToLair(ghost)
    ghostEatenSound.play()
  }
}

function calcGhostEatenPoints () {
  state.score += state.ghostsEatenPoints
  state.ghostsEatenPoints *= 2
}
/************************************************
PACMAN EATING FUNCTIONS (END)
*************************************************/

/************************************************
SCORING/ENDPOINT FUNCTIONS (START)
*************************************************/

function updateScore () {
  scoreDisplay.textContent = state.score
}

function checkForLifeLost () {
  const pacmanCurrentTile = state.squares[state.pacmanCurrentIndex]
  const didGhostGetPacman = pacmanCurrentTile.classList.contains('ghost')
  const isGhostFrightened = pacmanCurrentTile.classList.contains(
    'frightened-ghost'
  )

  if (didGhostGetPacman && !isGhostFrightened) {
    removeLife()
    removeAllGhosts()
    removePacman(pacmanCurrentTile)
    state.isPaused = true
    state.ghostsEatenPoints = 200
  }
}

function removeLife () {
  deathSound.play()
  stopPowerPillSound()

  if (state.livesLeft === 0) {
    gameOver()
  } else {
    state.livesLeft--
    updateLivesDisplay()
    getReadyTimer()
  }
}

function removeAllGhosts () {
  state.ghosts.forEach(ghost => {
    clearInterval(ghost.timerId)
    resetGhostTimers(ghost)
    removeAllGhostClasses(ghost)
  })
}

function removeAllGhostClasses (ghost) {
  state.squares[ghost.currentIndex].classList.remove(
    ghost.className,
    'ghost',
    'frightened-ghost',
    'frightened-ghost-flash'
  )
}

function gameOver () {
  state.isGameOver = true
  gameoverScreen.style.display = 'block'
  checkForHiscore()

  state.gameoverTimer = setTimeout(resetGame, 2000)
}

function checkForHiscore () {
  if (state.score > state.hiscore) {
    state.hiscore = state.score
    hiscoreDisplay.textContent = state.hiscore
    localStorage.setItem('pacmanHiscore', state.hiscore)
  }
}

function checkForLevelEnd () {
  // default is >243
  if (state.dotsEaten > 243) {
    stopPowerPillSound()
    startNextLevel()
  }
}

function startNextLevel () {
  state.isPaused = true
  state.dotsEaten = 0
  state.ghostsEatenPoints = 200
  state.firstBonusRemoved = false
  state.secondBonusRemoved = false
  removeAllGhosts()

  const pacmanCurrentTile = state.squares[state.pacmanCurrentIndex]
  removePacman(pacmanCurrentTile)

  grid.innerHTML = ''
  createBoard()

  getReadyTimer()
}
/************************************************
SCORING FUNCTIONS (END)
*************************************************/

/************************************************
FRIGHTEN & UNFRIGHTEN GHOST FUNCTIONS (START)
*************************************************/
function frightenGhosts () {
  state.ghosts.forEach(ghost => {
    resetGhostTimers(ghost)

    if (!state.squares[ghost.currentIndex].classList.contains('ghost-lair')) {
      ghost.isFrightened = true
      ghost.firstMoveAfterFrightened = true
      state.squares[ghost.currentIndex].classList.add('frightened-ghost')

      ghost.flashTimerId = setTimeout(() => makeGhostFlash(ghost), 7000)
      ghost.frightenedTimer = setTimeout(unFrightenGhosts, 10000)
    }
  })
}

function unFrightenGhosts () {
  state.ghosts.forEach(ghost => {
    ghost.isFrightened = false
    ghost.isFlashing = false
  })
  state.ghostsEatenPoints = 200
}

function isGhostFrightened (ghost) {
  if (ghost.isFrightened) {
    state.squares[ghost.currentIndex].classList.add('frightened-ghost')
  }

  if (ghost.isFlashing) {
    state.squares[ghost.currentIndex].classList.add('frightened-ghost-flash')
  }
}

function makeGhostFlash (ghost) {
  if (ghost.isFrightened) {
    ghost.isFlashing = true
    state.squares[ghost.currentIndex].classList.add('frightened-ghost-flash')
  }
}

function resetGhostTimers (ghost) {
  // so that eating second pill while ghosts frightened resets timer
  clearTimeout(ghost.frightenedTimer)
  clearTimeout(ghost.flashTimerId)
  state.squares[ghost.currentIndex].classList.remove('frightened-ghost-flash')
  ghost.isFlashing = false
}

function whichGhostWasEaten (pacmanCurrentSquare) {
  if (pacmanCurrentSquare.classList.contains('blinky')) return state.ghosts[0]
  if (pacmanCurrentSquare.classList.contains('pinky')) return state.ghosts[1]
  if (pacmanCurrentSquare.classList.contains('inky')) return state.ghosts[2]
  if (pacmanCurrentSquare.classList.contains('clyde')) return state.ghosts[3]
}

function returnGhostToLair (ghost) {
  removeAllGhostClasses(ghost)
  resetGhostTimers(ghost)

  // change ghosts currentIndex back to its startIndex
  ghost.isFrightened = false
  ghost.currentIndex = ghost.respawnIndex
  ghost.currentDirection = -width

  // state.score += 200
  calcGhostEatenPoints()
  updateScore()
  // re-add classnames of ghost.className and 'ghost' to the ghosts new postion
  state.squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
}
/************************************************
FRIGHTEN & UNFRIGHTEN GHOST FUNCTIONS (END)
*************************************************/

/************************************************
GHOST MOVEMENT FUNCTIONS (START)
*************************************************/
function initGhostMovement (ghost) {
  ghost.timerId = setInterval(function () {
    // each ghost has dotsEaten threshold for leaving lair
    if (state.dotsEaten >= ghost.startTimer) {
      moveGhost(ghost)
      isGhostFrightened(ghost)
      // checkForGameOver()
      checkForLifeLost()
    }
  }, ghost.speed)
}

function moveGhost (ghost) {
  if (ghost.isFrightened) {
    ghost.nextDirection = getFrightenedGhostDirection(ghost)
  } else {
    setGhostTarget(ghost)
    ghost.nextDirection = getNextGhostDirection(ghost)
  }

  state.squares[ghost.currentIndex].classList.remove(ghost.className)
  state.squares[ghost.currentIndex].classList.remove(
    'ghost',
    'frightened-ghost',
    'frightened-ghost-flash'
  )

  ghost.currentIndex += ghost.currentDirection

  //  override for ghost tunnel movement
  if (ghost.currentIndex === 392) {
    ghost.currentIndex = 419
    ghost.nextDirection = -1
  } else if (ghost.currentIndex === 419) {
    ghost.currentIndex = 392
    ghost.nextDirection = 1
  }

  state.squares[ghost.currentIndex].classList.add(ghost.className)
  state.squares[ghost.currentIndex].classList.add('ghost')

  ghost.currentDirection = ghost.nextDirection
}

function getNextGhostDirection (ghost) {
  // ghost plans movement one tile ahead, so we check nextTile for legal direction options
  // cannot reverse direction, return to lair, or move into wall
  const nextTile = ghost.currentIndex + ghost.currentDirection
  // console.log('currentIndex = ' + ghost.currentIndex)
  // console.log('currentDirection = ' + ghost.currentDirection)
  // console.log('nextTile = ' + nextTile)

  // if (nextTile === 392) {
  //   ghost.nextDirection = -1
  // } else if (nextTile === 419) {
  //   ghost.nextDirection = 1
  // } else {
  const legalDirections = getLegalGhostDirections(nextTile, ghost)

  if (legalDirections.length > 1) {
    return getTargetTileDistance(legalDirections, nextTile, ghost)
  } else {
    return legalDirections[0]
  }
  // }
}
/************************************************
GHOST MOVEMENT FUNCTIONS (END)
*************************************************/

/************************************************
FRIGHTENED GHOST MOVEMENT FUNCTIONS (START)
*************************************************/
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
/************************************************
FRIGHTENED GHOST MOVEMENT FUNCTIONS (END)
*************************************************/

/************************************************
GHOST MOVEMENT HELPER FUNCTIONS (START)
*************************************************/
function isDirectionLegal (tileIndex) {
  return (
    !state.squares[tileIndex].classList.contains('wall') &&
    !state.squares[tileIndex].classList.contains('ghost-lair')
  )
}

function getLegalGhostDirections (nextTile, ghost) {
  return ghostDirections.filter(direction => {
    const tileIndex = nextTile + direction

    if (direction === -ghost.currentDirection) return false
    if (
      state.squares[ghost.currentIndex].classList.contains('ghost-lair') &&
      state.squares[tileIndex].classList.contains('ghost-lair')
    ) {
      return true
    }

    return isDirectionLegal(tileIndex)
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
/************************************************
GHOST MOVEMENT HELPER FUNCTIONS (END)
*************************************************/

/************************************************
GHOST TARGETING FUNCTIONS (START)
*************************************************/
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
/************************************************
GHOST TARGETING FUNCTIONS (END)
*************************************************/
