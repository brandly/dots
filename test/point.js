import assert from 'assert'
import Point from '../src/models/point'

describe('Point', function () {
  it('can test equality', function () {
    const x = 3, y = 5

    const a = new Point(x, y)
    const b = new Point(x, y)
    const c = new Point(x + 1, y - 1)

    assert.equal(true, a.isEqual(b))
    assert.equal(false, a.isEqual(c))
  })

  it('can measure distance', function () {
    const x = 1, y = 1

    const a = new Point(x, y)
    const b = new Point(x + 3, y + 4)

    assert.equal(5, a.distanceTo(b))
  })
})
