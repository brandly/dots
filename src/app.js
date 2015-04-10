import GameModel from './models/game'
import GameView from './views/game'

const { innerHeight, innerWidth } = window

// TODO: display the score somewhere, create "timed games" and such
new GameView('#game', {
  width: Math.min(innerHeight, innerWidth),
  game: new GameModel({
    size: 6,
    colors: ['#FF0000', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF']
  })
})
