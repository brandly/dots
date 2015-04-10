import Events from './events'
import Canvas from './canvas'
import Point from '../models/point'

export default class Game {
  constructor(selector, data) {
    this.game = data.game
    this.board = this.game.getBoard()

    this.root = document.querySelector(selector)
    this.width = data.width
    this.height = this.width

    this.distanceBetweenDots = this.width / this.game.getSize()
    this.margin = this.distanceBetweenDots / 2
    this.dotDiameter = this.margin
    this.touchPoint = null

    this.initCanvas(this.root)

    this.drawGame()
    this.game.addChangeListener(this._onChange.bind(this))

    const canvasEl = this.canvas.getElement()
    const onMove = this._onMove.bind(this)
    canvasEl.addEventListener(Events.down, (event) => {
      this._onDown(event)
      canvasEl.addEventListener(Events.move, onMove)
    })
    canvasEl.addEventListener(Events.up, (event) => {
      this._onUp(event)
      canvasEl.removeEventListener(Events.move, onMove)
    })
  }

  initCanvas(container) {
    this.canvas = new Canvas
    this.canvas.setWidth(this.width)
    this.canvas.setHeight(this.height)
    container.appendChild(this.canvas.getElement())
  }

  _onChange() {
    console.log('SCORE:', this.game.score)
    this.drawGame()
  }

  _onDown(event) {
    this.selectDotIfCloseToPoint(event)
    this.drawGame()
  }

  _onMove(event) {
    event.preventDefault()
    this.selectDotIfCloseToPoint(event)
    this.drawGame()
  }

  _onUp(event) {
    this.touchPoint = null
    this.game.releaseBoard()
  }

  selectDotIfCloseToPoint(event) {
    this.touchPoint = this.canvas.getTouchPoint(event)
    const priorDot = this.game.getPriorDot()

    this.board.applyToAllDots((dot, x, y) => {
      const drawnDot = this.dotPointToDrawPoint(new Point(x, y))
      if (this.touchPoint.distanceTo(drawnDot) <= this.dotDiameter) {
        if (priorDot === dot) {
          this.game.releaseActiveDot()
        } else {
          this.game.selectDot(dot)
        }
      }
    })
  }

  drawGame() {
    this.canvas.clear()
    this.drawLines(this.canvas)
    this.drawDots(this.canvas)
  }

  drawLines(canvas) {
    const activeDot = this.game.getActiveDot()

    if (activeDot) {
      canvas.setDrawColor(this.game.getActiveColor())
      canvas.getContext().lineWidth = this.dotDiameter / 4

      const linePoints = this.game.getSelectedDots().map(d => {
        return this.dotPointToDrawPoint(this.board.getPointForDot(d))
      })
      linePoints.push(this.touchPoint)

      for (let i = 1; i < linePoints.length; i++) {
        canvas.drawLine(linePoints[i - 1], linePoints[i])
      }
    }
  }

  drawDots(canvas) {
    const context = this.canvas.getContext()
    context.lineWidth = this.dotDiameter
    context.lineJoin = 'round'

    this.board.applyToAllDots((dot, x, y) => {
      const location = this.dotPointToDrawPoint(new Point(x, y))
      canvas.setDrawColor(dot.getColor())
      canvas.drawCircle(location)
    })
  }

  // TODO: improve the terminology here?
  dotPointToDrawPoint(point) {
    const { distanceBetweenDots, margin } = this
    const { x, y } = point

    return new Point(margin + x * distanceBetweenDots, margin + y * distanceBetweenDots)
  }
}
