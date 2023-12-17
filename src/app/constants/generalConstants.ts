export const playIcon = '<i class="fas fa-play"></i>'
export const pauseIcon = '<i class="fas fa-pause"></i>'
export const pacmanHTML =
  '<div class="pacman-top"></div><div class="pacman-bottom"></div>'
export const width = 28
export const height = 31
export const pacmanStartIndex = 658
export const ghostDirections = [-width, -1, width, 1] // up, left, down, right

/**
 * Speed calculations:
 * In the original pacman, 100% speed is 75.75 pixels per second
 * 28 tiles per row, 244 pixels per row
 * So, 8.7 tiles per second
 * 115ms per tile
 *
 * for level 1:
 * pacman is 80% of original speed
 * ghosts are 75% of original speed
 * frightened pacman is 90% of original speed
 * frightened ghosts are 50% of original speed
 */

export const fullSpeedMilliseconds = 115
export const pacmanInterval = fullSpeedMilliseconds / 0.8
export const pacmanFrightenedInterval = fullSpeedMilliseconds / 0.9
export const ghostInterval = fullSpeedMilliseconds / 0.75
export const ghostFrightenedInterval = fullSpeedMilliseconds / 0.5
