import {expect} from 'chai'

import {formatDuration} from '../../src/utils/dates.js'

describe('formatDuration', () => {
  it('shows seconds only under a minute', () => {
    expect(formatDuration(0)).to.equal('0s')
    expect(formatDuration(45)).to.equal('45s')
  })

  it('shows minutes and seconds under an hour', () => {
    expect(formatDuration(60)).to.equal('1m 0s')
    expect(formatDuration(570)).to.equal('9m 30s')
    expect(formatDuration(3599)).to.equal('59m 59s')
  })

  it('drops seconds once there are hours', () => {
    expect(formatDuration(3600)).to.equal('1h 0m')
    expect(formatDuration(5430)).to.equal('1h 30m')
  })

  it('rounds fractional seconds and clamps negatives to zero', () => {
    expect(formatDuration(45.4)).to.equal('45s')
    expect(formatDuration(45.6)).to.equal('46s')
    expect(formatDuration(-10)).to.equal('0s')
  })
})
