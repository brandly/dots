import { contains, reject, unique } from 'lodash'
import ChangeEmitter from './change-emitter'
import Board from './board'

export default class Game extends ChangeEmitter {
  constructor({ size, colors }) {
    super()
    this.board = new Board({ size, colors })

    this.selectedDots = []
    this.dotsToSelectFrom = []

    this.score = 0
    this.board.addClearDotListener(this.incrementScore.bind(this))
  }

  getScore() {
    return this.score
  }

  getBoard() {
    return this.board
  }

  getSize() {
    return this.board.size
  }

  getActiveDot() {
    return this.selectedDots[this.selectedDots.length - 1] || null
  }

  getPriorDot() {
    const len = this.selectedDots.length
    return (len > 1) ? this.selectedDots[len - 2] : null
  }

  getSelectedDots() {
    return this.selectedDots
  }

  getActiveColor() {
    const dot = this.getActiveDot()
    return dot ? dot.color : ''
  }

  selectDot(dot) {
    if (this.canSelectDot(dot)) {
      this.selectedDots.push(dot)
      this.updateDotsToSelectFrom()
      this.emitChange()
    }
  }

  updateDotsToSelectFrom() {
    const activeDot = this.getActiveDot()
    this.dotsToSelectFrom = reject(this.board.getAdjacentDotsOfSameColor(activeDot), d => {
                              return d === activeDot
                            })
  }

  clearSelectedDots() {
    this.selectedDots = []
    this.dotsToSelectFrom = []
    this.emitChange()
  }

  canSelectDot(dot) {
    if (!this.getActiveDot()) {
      return true
    } else {
      return contains(this.dotsToSelectFrom, dot)
    }
  }

  releaseActiveDot() {
    this.selectedDots.pop()
    this.updateDotsToSelectFrom()
    this.emitChange()
  }

  releaseBoard() {
    if (this.hasClosedCircuit()) {
      this.board.removeDotsOfColor(this.getActiveColor())
    } else if (this.hasSelectedMultipleDots()) {
      // TODO: remove dots inside of circuit too
      this.board.removeArrayOfDots(this.selectedDots)
    }

    while (!this.hasLegalMove()) {
      this.board.removeDotsOfColor(this.board.getRandomColor())
    }

    this.clearSelectedDots()
  }

  hasClosedCircuit() {
    return unique(this.selectedDots).length !== this.selectedDots.length
  }

  hasLegalMove() {
    const dots = this.board.getAllDots()

    for (let i = 0; i < dots.length; i++) {
      if (this.board.getAdjacentDotsOfSameColor(dots[i]).length) {
        return true
      }
    }

    return false
  }

  isSelectedDot(dot) {
    return contains(this.selectedDots, dot)
  }

  hasSelectedMultipleDots() {
    return this.selectedDots.length > 1
  }

  incrementScore() {
    this.score += 1
  }
}
