import { createNewGhosts } from './ghosts.js'

export const state = {
  squares: [],
  score: 0,
  pacmanCurrentIndex: 490,
  isPaused: true,
  isGameOver: true,
  ghosts: createNewGhosts()
}
