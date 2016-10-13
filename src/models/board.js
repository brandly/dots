import { contains, flatten, random, sortBy } from 'lodash'
import ChangeEmitter from './change-emitter'
import Point from './point'
import Dot from './dot'

const CLEAR_DOT_EVENT = 'CLEAR_DOT'

export default class Board extends ChangeEmitter {
  constructor({ size, colors }) {
    super()
    this.size = size
    this.colors = colors
    this.dots = []

    for (let x = 0; x < this.size; x++) {
      let column = []
      for (let y = 0; y < this.size; y++) {
        column.push(this.getRandomlyColoredDot())
      }
      this.dots.push(column)
    }
  }

  getRandomlyColoredDot() {
    return new Dot({
      color: this.getRandomColor()
    })
  }

  getRandomColor() {
    return this.colors[random(this.colors.length - 1)]
  }

  getAdjacentDotsOfSameColor(dot) {
    const point = this.getPointForDot(dot)

    return this.getAdjacentPoints(point)
               .map(p => this.getDotAtPoint(p))
               .filter(d => d.getColor() === dot.getColor())
  }

  getAdjacentPoints(point) {
    const adjacents = []
    // above
    if (point.y > 0) adjacents.push(new Point(point.x, point.y - 1))
    // right
    if (point.x + 1 < this.size) adjacents.push(new Point(point.x + 1, point.y))
    // below
    if (point.y + 1 < this.size) adjacents.push(new Point(point.x, point.y + 1))
    // left
    if (point.x > 0) adjacents.push(new Point(point.x - 1, point.y))
    return adjacents
  }

  getDotAtPoint(point) {
    return this.dots[point.x][point.y]
  }

  getPointForDot(dot) {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (dot === this.dots[x][y]) {
          return new Point(x, y)
        }
      }
    }
    return null
  }

  getDotsOfColor(color) {
    return flatten(this.dots).filter(d => d.color === color)
  }

  removeDotsOfColor(color) {
    this.removeArrayOfDots(this.getDotsOfColor(color))
    this.emitChange()
  }

  removeArrayOfDots(arr) {
    this.applyToAllDots((dot, x, y) => {
      if (contains(arr, dot)) {
        this.dots[x][y] = null
        this.emitClearDot(new Point(x, y))
      }
    })

    for (let x = 0; x < this.size; x++) {
      this.dots[x] = this.makeDotsFall(this.dots[x])
    }

    this.applyToAllDots((dot, x, y) => {
      if (dot === null) {
        this.dots[x][y] = this.getRandomlyColoredDot()
      }
    })
    this.emitChange()
  }

  applyToAllDots(fn) {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        fn.call(this, this.dots[x][y], x, y)
      }
    }
  }

  getAllDots() {
    const allDots = []
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        allDots.push(this.dots[x][y])
      }
    }
    return allDots
  }

  makeDotsFall(column) {
    return sortBy(column, function (dot) {
      if (dot === null) {
        return -1
      } else {
        return 1
      }
    })
  }

  emitClearDot(point) {
    this.emit(CLEAR_DOT_EVENT, point)
  }

  addClearDotListener(callback) {
    this.on(CLEAR_DOT_EVENT, callback)
  }

  removeClearDotListener(callback) {
    this.removeListener(CLEAR_DOT_EVENT, callback)
  }
}
