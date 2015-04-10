export default class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  isEqual(point) {
    return this.x === point.x && this.y === point.y
  }

  distanceTo(point) {
    const { abs, sqrt } = Math
    const deltaX = abs(this.x - point.x)
    const deltaY = abs(this.y - point.y)
    return sqrt((deltaX * deltaX) + (deltaY * deltaY))
  }
}
