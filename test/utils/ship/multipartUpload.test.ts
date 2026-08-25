import {expect} from 'chai'

import {calculateParts, withRetry} from '@cli/utils/ship/multipartUpload.js'

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

describe('withRetry (ship/multipartUpload)', () => {
  const noop = () => {}

  it('returns the value without retrying when the first attempt works', async () => {
    let calls = 0
    const result = await withRetry(async () => {
      calls += 1
      return 'ok'
    }, noop)

    expect(result).to.equal('ok')
    expect(calls).to.equal(1)
  })

  it('stops at once when the error is not worth retrying', async () => {
    let calls = 0

    try {
      await withRetry(async () => {
        calls += 1
        throw Object.assign(new Error('not found'), {status: 404})
      }, noop)
      expect.fail('withRetry should have thrown')
    } catch (error) {
      expect((error as Error).message).to.equal('not found')
    }

    expect(calls).to.equal(1)
  })

  it('retries a retryable error, and tells onRetry which attempt failed', async () => {
    const seen: number[] = []
    let calls = 0

    const result = await withRetry(
      async () => {
        calls += 1
        if (calls === 1) throw Object.assign(new Error('expired'), {status: 403})
        return 'ok'
      },
      (_error, attempt) => {
        seen.push(attempt)
      },
    )

    expect(result).to.equal('ok')
    expect(calls).to.equal(2)
    expect(seen).to.deep.equal([1])
  })
})
