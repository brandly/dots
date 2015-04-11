import Point from '../models/point'

export default class Canvas {
  constructor() {
    this.el = document.createElement('canvas')
    this.context = this.el.getContext('2d')
  }

  getElement() {
    return this.el
  }

  getContext() {
    return this.context
  }

  setWidth(width) {
    this.el.width = width
  }

  setHeight(height) {
    this.el.height = height
  }

  setStrokeColor(color) {
    this.context.strokeStyle = color
  }

  setFillColor(color) {
    this.context.fillStyle = color
  }

  clear() {
    this.el.width = this.el.width
  }

  drawCircle(position, diameter) {
    this.context.beginPath()
    this.context.arc(position.x, position.y, diameter / 2, 0, 2 * Math.PI, false)
    this.context.fill()
  }

  drawLine(start, end) {
    this.context.beginPath()
    this.context.moveTo(start.x, start.y)
    this.context.lineTo(end.x, end.y)
    this.context.closePath()
    this.context.stroke()
  }

  getTouchPoint(event) {
    let el = this.el
    let totalOffsetX = 0
    let totalOffsetY = 0

    do {
      totalOffsetX += el.offsetLeft - el.scrollLeft
      totalOffsetY += el.offsetTop - el.scrollTop
    } while(el = el.offsetParent)

    const x = event.pageX - totalOffsetX - window.scrollX
    const y = event.pageY - totalOffsetY - window.scrollY
    return new Point(x, y)
  }
}
