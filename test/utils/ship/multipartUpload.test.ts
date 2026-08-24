import {expect} from 'chai'

import {calculateParts} from '@cli/utils/ship/multipartUpload.js'

const MIB = 1024 * 1024

describe('calculateParts (ship/multipartUpload)', () => {
  it('numbers the parts from 1 and covers the whole file', () => {
    const parts = calculateParts(20 * MIB, 8 * MIB)

    expect(parts.map((part) => part.partNumber)).to.deep.equal([1, 2, 3])
    expect(parts.map((part) => part.start)).to.deep.equal([0, 8 * MIB, 16 * MIB])
    expect(parts.reduce((total, part) => total + part.size, 0)).to.equal(20 * MIB)
  })

  it('makes the last part smaller than the rest', () => {
    const parts = calculateParts(20 * MIB, 8 * MIB)

    expect(parts[0].size).to.equal(8 * MIB)
    expect(parts[1].size).to.equal(8 * MIB)
    expect(parts[2].size).to.equal(4 * MIB)
  })

  it('makes one part when the file is smaller than a part', () => {
    const parts = calculateParts(3 * MIB, 8 * MIB)

    expect(parts).to.have.length(1)
    expect(parts[0]).to.deep.equal({partNumber: 1, size: 3 * MIB, start: 0})
  })

  it('makes no gap and no overlap when the size divides exactly', () => {
    const parts = calculateParts(16 * MIB, 8 * MIB)

    expect(parts).to.have.length(2)
    expect(parts[1].start).to.equal(parts[0].start + parts[0].size)
    expect(parts[1].size).to.equal(8 * MIB)
  })

  it('returns no parts for an empty file', () => {
    expect(calculateParts(0, 8 * MIB)).to.deep.equal([])
  })
})
