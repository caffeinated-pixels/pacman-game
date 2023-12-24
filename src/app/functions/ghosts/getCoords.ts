import { Ghost } from './create-ghosts'

export const getIndexCoords = (tileIndex: number) => {
  // find the X,Y coordinates of a given index
  const coordY = Math.floor(tileIndex / 28)
  const coordX = tileIndex - coordY * 28

  return [coordX, coordY]
}

export const calcDistance = (point1XY: number[], point2XY: number[]) => {
  return Math.sqrt(
    (point1XY[0] - point2XY[0]) ** 2 + (point1XY[1] - point2XY[1]) ** 2
  )
}

export const getTargetTileDistance = (
  legalDirections: number[],
  nextTile: number,
  ghost: Ghost
) => {
  const shortestDistance = legalDirections.map((direction) => {
    const optionTileIndex = nextTile + direction

    const optionXY = getIndexCoords(optionTileIndex)
    const targetXY = getIndexCoords(ghost.targetTile)

    const distance = calcDistance(optionXY, targetXY)

    return {
      direction,
      distance,
    }
  })

  shortestDistance.sort((a, b) => {
    return a.distance - b.distance
  })
  // console.log(shortestDistance)
  return shortestDistance[0].direction
}
