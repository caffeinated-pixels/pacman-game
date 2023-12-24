import { width } from '../../constants/generalConstants'
import { Ghost } from './create-ghosts'
import { calcDistance, getIndexCoords } from './getCoords'
import { GameState } from '../game-setup/initializeState'

function getBlinkysTarget(state: GameState) {
  // Blinky's target is Pacman's current tile
  return state.pacmanCurrentIndex
}

function getPinkysTarget(state: GameState) {
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

function getInkysTarget(state: GameState) {
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

function getClydesTarget(state: GameState, clyde: Ghost) {
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

export const setGhostTarget = (state: GameState, ghost: Ghost) => {
  // if in ghost lair, set targetTile manually
  if (state.squares[ghost.currentIndex].classList.contains('ghost-lair')) {
    ghost.targetTile = 321
  } else {
    // else we use specific logic routines to calculate
    if (ghost.className === 'blinky') ghost.targetTile = getBlinkysTarget(state)
    if (ghost.className === 'pinky') ghost.targetTile = getPinkysTarget(state)
    if (ghost.className === 'inky') ghost.targetTile = getInkysTarget(state)
    if (ghost.className === 'clyde')
      ghost.targetTile = getClydesTarget(state, ghost)
  }
}
