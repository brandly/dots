import GameModel from './models/game'
import GameView from './views/game'

const { innerHeight, innerWidth } = window

// TODO: display the score somewhere, create "timed games" and such
new GameView('#game', {
  width: Math.min(innerHeight, innerWidth),
  game: new GameModel({
    size: 6,
    colors: ['#F15C3B', '#89ED90', '#E7DD00', '#8ABDFF', '#9D5AB7']
  })
})
