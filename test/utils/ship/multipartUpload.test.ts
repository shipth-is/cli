import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import {expect} from 'chai'

import {calculateParts, readPart, withRetry} from '@cli/utils/ship/multipartUpload.js'

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
        if (calls === 1) throw Object.assign(new Error('busy'), {status: 429})
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

describe('readPart (ship/multipartUpload)', () => {
  const filePath = path.join(os.tmpdir(), 'shipthis-readPart-test.bin')

  // Byte i of the file is i % 251, so a wrong offset is easy to spot
  const contents = Uint8Array.from({length: 4096}, (_, i) => i % 251)

  beforeEach(() => fs.writeFileSync(filePath, contents))
  afterEach(() => fs.rmSync(filePath, {force: true}))

  it('reads the bytes at the start of the part, not the start of the file', async () => {
    const body = await readPart(filePath, {partNumber: 2, size: 100, start: 1000})

    expect(body).to.have.length(100)
    expect([...body]).to.deep.equal([...contents.subarray(1000, 1100)])
  })

  it('keeps reading when the filesystem gives back less than it was asked for', async () => {
    // A network mount can answer with part of the request. Make every read
    // return at most 30 bytes, so filling a 100 byte part needs several.
    const handle = await fs.promises.open(filePath, 'r')
    const fileHandle = Object.getPrototypeOf(handle)
    const realRead = fileHandle.read
    await handle.close()

    let reads = 0
    fileHandle.read = function (buffer: Uint8Array, offset: number, length: number, position: number) {
      reads += 1
      return realRead.call(this, buffer, offset, Math.min(length, 30), position)
    }

    try {
      const body = await readPart(filePath, {partNumber: 1, size: 100, start: 0})

      expect(reads).to.be.greaterThan(1)
      expect([...body]).to.deep.equal([...contents.subarray(0, 100)])
    } finally {
      fileHandle.read = realRead
    }
  })

  it('fails when the file ends before the part is full', async () => {
    try {
      await readPart(filePath, {partNumber: 9, size: 500, start: 4000})
      expect.fail('readPart should have thrown')
    } catch (error) {
      expect((error as Error).message).to.equal('Part 9 read 96 bytes, expected 500')
    }
  })
})
