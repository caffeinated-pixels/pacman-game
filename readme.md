# Pacman game

This a simplified Pacman clone that I built in HTML and vanilla JavaScript. You can [see the game in action here](https://mercboy-pacman.netlify.app/).

As a starting point, I used Ania Kubow's [Scrimba tutorial](https://scrimba.com/). However, I have significantly refactored, expanded and styled the tutorial version to make the game my own and to look and play more like the Namco 1980 arcade classic. Doing so has been fun, challenging and learning experience and a good excuse to fire up Pacman on MAME.

I based many of my design decisions on [The Pac-Man Dossier](https://www.gamasutra.com/view/feature/3938/the_pacman_dossier.php?print=1), which is a fascinating deep-dive by Jamey Pittman into the history and design of Pacman.

Features that I've added to the tutorial version include:

- ghost pathfinding logic - each ghost has a unique targeting scheme (see notes below)
- modified ghost behaviour when "frightened"
- ghosts flash when frightened state coming to an end
- ghosts have a dots-eaten threshold for leaving the lair
- ghost can move through the tunnel
- three lives for Pacman
- bonus cherries that appear after 70 & 170 dots eaten
- infinite levels
- persistent hiscore (using web storage API)
- start, pause & reset functions
- start, get ready, paused & game over screens
- Pacman animation & ghost "sprites"
- game sounds
- d-pad controls (for mobile screens)

## Pac-man revisited 2023

I've been tweaking the game and adding some new features, including:

- using Parcel to serve as a JS bundle (making it easier to modularize)
- complete typescript conversion
- updated speed and controls to match the original game better:
  - both pac-man and the ghosts move significantly faster around the maze (making it more difficult)
  - ghosts now slow down while frightened
  - pac-man moves continuously without further input and only stops moving if he hits a wall

Other potential features/fixes that I may (or may not) work on in the future:

- better pac-man and ghost movement animations
- ghost scatter-chase alternation behaviour
- more bonus items
- increasing difficultly with new levels
- ghosts travelling back to the lair after being eaten (rather than instantly respawning there)
- make eating frightened ghost more reliable
- pause function should also pause the frightened timer

## Coding notes

### Ghost behaviour

Ghosts plan their moves one tile ahead, where they choose a legal direction option based on which is the closest (straight line) to their target tile. Ghosts cannot reverse their direction, except for when they first enter the frightened state.

Each ghost has a unique targeting scheme:

- **Blinky** (the red ghost!) targets Pacman's current tile.

- **Pinky** targets an offset, which is four tiles ahead of Pacman's current heading.

- **Inky** (the light blue ghost!) has the most complex targeting scheme. We draw a line from Blinky's current position to an offset of two tiles in front of Pacman. We then double the distance of this line and continue past the offset in the same direction.

- **Clyde** (the orange ghost!) sort of does his own thing. If he is further than eight tiles from Pacman, he targets Pacman's current tile. But if Pacman is within eight tiles, Clyde heads to his scatter target, which is the bottom left corner of the maze.

Frightened ghosts move in a semi-random fashion. First, they reverse direction, if it's possible to do so, then they choose a random direction for each subsequent move. If that direction is not legal, they choose from the legal possibilities in the order of up, left, down, right.

### Pacman animation

I based the animation on this [codepen](https://codepen.io/wifi/pen/olKxE)

Pacman is divided into a top and bottom `<div>`, each with a background colour of yellow. We use the `border-radius` property to turn each half into a semi-circle. We then use `transform` and `@keyframes` to rotate each half in opposite directions (35deg and -35deg). Cute!

### Audio on iOS

So, iOS disables the playback of any HTML5 audio that is not directly initiated by the user. I guess this is to prevent annoying autoplaying music, etc, but it's very frustrating when you're trying to implement game audio!

I found a hack to workaround this issue. Basically, you can "unlock" the audio objects by setting up an event listener that plays all the sounds the first time the user touches the screen (`touchstart` event). Obviously, we don't want the user to hear this, so we need to immediately stop and reset each sample.
