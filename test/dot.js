import assert from 'assert'
import Dot from '../src/models/dot'

describe('Dot', function () {
  it('has a color', function () {
    const color = '#bada55'

    const dot = new Dot({ color })
    assert.equal(color, dot.getColor())
  })
})
