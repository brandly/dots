const hasTouch = 'ontouchstart' in document.documentElement

export default {
  down: hasTouch ? 'touchstart' : 'mousedown',
  move: hasTouch ? 'touchmove' : 'mousemove',
  up: hasTouch ? 'touchend' : 'mouseup',
  out: hasTouch ? 'touchcancel' : 'mouseout'
}
