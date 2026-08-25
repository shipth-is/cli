import {expect} from 'chai'

import {getS3Error, isRetryable} from '@cli/utils/errors.js'

// The shape Spaces really answers with, taken from a live failed request
const s3Error = (code: string, message: string) =>
  `<?xml version="1.0" encoding="UTF-8"?><Error><Code>${code}</Code><Message>${message}</Message>` +
  `<Resource>bucket/key.zip</Resource><RequestId>not available</RequestId></Error>`

describe('getS3Error (utils/errors)', () => {
  it('names what failed and keeps the status', async () => {
    const error = await getS3Error(new Response('no', {status: 403, statusText: 'Forbidden'}), 'Part 3')

    expect(error).to.be.instanceOf(Error)
    expect(error.message).to.equal('Part 3 failed: 403 Forbidden')
    expect(error.status).to.equal(403)
  })

  it('says what S3 said, rather than the status text', async () => {
    const body = s3Error(
      'RequestTimeout',
      'Your socket connection to the server was not read from or written to within the timeout period.',
    )
    const error = await getS3Error(new Response(body, {status: 400, statusText: 'Bad Request'}), 'Part 8')

    expect(error.code).to.equal('RequestTimeout')
    expect(error.message).to.equal(
      'Part 8 failed: 400 RequestTimeout - Your socket connection to the server was not read from ' +
        'or written to within the timeout period.',
    )
  })
})

describe('isRetryable (utils/errors)', () => {
  it('retries an error that has no status', () => {
    expect(isRetryable(new Error('fetch failed'))).to.equal(true)
  })

  it('retries a server error and the two wait-and-see client errors', () => {
    expect(isRetryable({status: 503})).to.equal(true)
    expect(isRetryable({status: 408})).to.equal(true)
    expect(isRetryable({status: 429})).to.equal(true)
  })

  it('does not retry the other client errors', () => {
    expect(isRetryable({status: 400})).to.equal(false)
    expect(isRetryable({status: 401})).to.equal(false)
    expect(isRetryable({status: 404})).to.equal(false)
  })

  // An authenticated call cannot recover from a 403. A caller that can, such as
  // uploadPart with a stale signed URL, handles its own 403.
  it('does not retry a 403', () => {
    expect(isRetryable({status: 403})).to.equal(false)
  })

  it('reads the status axios sets on the errors it throws', async () => {
    expect(isRetryable(await getS3Error(new Response('', {status: 404}), 'Part 1'))).to.equal(false)
  })

  // A dropped network leaves a part half sent, and S3 answers 400 RequestTimeout.
  // Giving up there loses the whole upload, which is what a 700MB test did.
  it('retries a 400 that S3 named RequestTimeout', async () => {
    const body = s3Error('RequestTimeout', 'Your socket connection to the server was not read from or written to.')
    const error = await getS3Error(new Response(body, {status: 400, statusText: 'Bad Request'}), 'Part 8')

    expect(isRetryable(error)).to.equal(true)
  })

  it('does not retry a 400 that S3 named InvalidPart', async () => {
    const body = s3Error('InvalidPart', 'One or more of the specified parts could not be found.')
    const error = await getS3Error(new Response(body, {status: 400, statusText: 'Bad Request'}), 'Complete')

    expect(isRetryable(error)).to.equal(false)
  })

  it('falls back to the status when the body names nothing', async () => {
    const error = await getS3Error(new Response('not xml', {status: 503}), 'Part 1')

    expect(error.code).to.equal(undefined)
    expect(isRetryable(error)).to.equal(true)
  })
})
